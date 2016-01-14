/*
 * Copyright (c) 2014. The Trustees of Indiana University.
 *
 * This version of the code is licensed under the MPL 2.0 Open Source license with additional
 * healthcare disclaimer. If the user is an entity intending to commercialize any application
 * that uses this code in a for-profit venture, please contact the copyright holder.
 */

package com.muzima.adapters.patients;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import com.muzima.MuzimaApplication;
import com.muzima.adapters.ListAdapter;
import com.muzima.adapters.observations.ConceptsBySearch;
import com.muzima.api.model.Patient;
import com.muzima.api.model.User;
import com.muzima.controller.NotificationController;
import com.muzima.controller.PatientController;
import com.muzima.utils.Constants;
import com.muzima.utils.ObsInterface;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class PatientsLocalSearchAdapter extends ListAdapter<Patient> {
    private static final String TAG = "PatientsLocalSearchAdapter";
    public static final String SEARCH = "search";
    private final PatientAdapterHelper patientAdapterHelper;
    private PatientController patientController;
    private final String cohortId;
    private boolean isNotificationsList;
    private Context context;
    protected BackgroundListQueryTaskListener backgroundListQueryTaskListener;

    public PatientsLocalSearchAdapter(Context context, int textViewResourceId,
                                      PatientController patientController, String cohortId, boolean isNotificationList) {
        super(context, textViewResourceId);
        this.context = context;
        this.patientController = patientController;
        this.cohortId = cohortId;
        this.isNotificationsList = isNotificationList;
        this.patientAdapterHelper = new PatientAdapterHelper(context, textViewResourceId);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        return patientAdapterHelper.createPatientRow(getItem(position), convertView, parent, getContext());
    }

    @Override
    public void reloadData() {
        new BackgroundQueryTask().execute(cohortId);
    }

    public void search(String text) {
        new BackgroundQueryTask().execute(text, SEARCH);
    }

    public void setBackgroundListQueryTaskListener(BackgroundListQueryTaskListener backgroundListQueryTaskListener) {
        this.backgroundListQueryTaskListener = backgroundListQueryTaskListener;
    }


    private class BackgroundQueryTask extends AsyncTask<String, Void, List<Patient>> {

        @Override
        protected void onPreExecute() {
            patientAdapterHelper.onPreExecute(backgroundListQueryTaskListener);
        }

        @Override
        protected List<Patient> doInBackground(String... params) {
            List<Patient> patients = null;
            List<Patient> patientsNotification = null;
            if (isSearch(params)) {
                try {
                    if (isNotificationsList) {
                        return filterPatientsWithNotifications(patientController.searchPatientLocally(params[0], cohortId));
                    } else {
                        return patientController.searchPatientLocally(params[0], cohortId);
                    }
                } catch (PatientController.PatientLoadException e) {
                    Log.w(TAG, String.format("Exception occurred while searching patients for %s search string." , params[0]), e);
                }
            }

            if(ObsInterface.showNotification){
                try {
                    patientsNotification = patientController.getAllPatients();
                    ConceptsBySearch conceptsBySearch = new
                            ConceptsBySearch(((MuzimaApplication) context.getApplicationContext()).getObservationController(),"","");
                    Iterator<Patient> patientIterator = patientsNotification.iterator();
                    while (patientIterator.hasNext()) {
                        Patient s = patientIterator.next();
                        if(!conceptsBySearch.ConceptsWithObs("SYSTOLIC BLOOD PRESSURE", s.getUuid()).isEmpty()){
                            patientIterator.remove();
                        }
                    }
                } catch (PatientController.PatientLoadException e) {
                    Log.w(TAG, "Exception occurred while fetching patients", e);
                }
                return patientsNotification;
            }else{
                String cohortUuid = params[0];
                try {
                    if (cohortUuid != null) {
                        patients = patientController.getPatients(cohortUuid);
                    } else if (isNotificationsList) {
                        patients = filterPatientsWithNotifications(null);
                    } else {
                        patients = patientController.getAllPatients();
                    }
                } catch (PatientController.PatientLoadException e) {
                    Log.w(TAG, "Exception occurred while fetching patients", e);
                }
                return patients;
            }
        }

        private boolean isSearch(String[] params) {
            return params.length == 2 && SEARCH.equals(params[1]);
        }

        @Override
        protected void onPostExecute(List<Patient> patients) {
            patientAdapterHelper.onPostExecute(patients, PatientsLocalSearchAdapter.this, backgroundListQueryTaskListener);
        }
    }

    private List<Patient> filterPatientsWithNotifications(List<Patient> patientList) {
        NotificationController notificationController = ((MuzimaApplication) context.getApplicationContext()).getNotificationController();
        List<Patient> notificationPatients = null;
        try {
            if (patientList == null)
                patientList = patientController.getAllPatients();

            if (patientList.size() >= 1)  {
                notificationPatients = new ArrayList<Patient>();
                User authenticatedUser = ((MuzimaApplication) context.getApplicationContext()).getAuthenticatedUser();
                if (authenticatedUser != null) {
                    for (Patient patient : patientList)  {
                        if (notificationController.patientHasNotifications(patient.getUuid(), authenticatedUser.getPerson().getUuid(),
                                Constants.NotificationStatusConstants.NOTIFICATION_UNREAD))
                            notificationPatients.add(patient) ;
                    }
                }
            }
        } catch (PatientController.PatientLoadException e) {
            Log.w(TAG, "Exception occurred while fetching patients", e);
        } catch (NotificationController.NotificationFetchException e) {
            Log.w(TAG, "Exception occurred while fetching patients", e);
        }
        return notificationPatients;
    }

    private class ViewHolder {
        ImageView genderImg;
        TextView name;
        TextView dateOfBirth;
        TextView identifier;
    }
}