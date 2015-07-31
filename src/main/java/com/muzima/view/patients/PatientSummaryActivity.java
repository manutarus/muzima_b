/*
 * Copyright (c) 2014. The Trustees of Indiana University.
 *
 * This version of the code is licensed under the MPL 2.0 Open Source license with additional
 * healthcare disclaimer. If the user is an entity intending to commercialize any application
 * that uses this code in a for-profit venture, please contact the copyright holder.
 */

package com.muzima.view.patients;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.actionbarsherlock.view.Menu;
import com.muzima.MuzimaApplication;
import com.muzima.R;
import com.muzima.adapters.observations.ConceptsBySearch;
import com.muzima.adapters.patients.PatientAdapterHelper;
import com.muzima.api.model.Patient;
import com.muzima.api.model.User;
import com.muzima.controller.*;
import com.muzima.service.JSONInputOutputToDisk;
import com.muzima.utils.Constants;
import com.muzima.utils.ObsInterface;
import com.muzima.view.BaseActivity;
import com.muzima.view.encounters.EncountersActivity;
import com.muzima.view.forms.PatientFormsActivity;
import com.muzima.view.notifications.PatientNotificationActivity;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import static com.muzima.utils.DateUtils.getFormattedDate;

public class PatientSummaryActivity extends BaseActivity {
    private static final String TAG = "PatientSummaryActivity";
    public static final String PATIENT = "patient";
    private static final String APP_EXTERNAL_DIR_ROOT =  Environment.getExternalStorageDirectory().getPath() + "/muzima";
    public static final String APP_MEDIA_DIR = APP_EXTERNAL_DIR_ROOT + "/media";

    private BackgroundQueryTask mBackgroundQueryTask;

    private Patient patient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_client_summary);

        Bundle intentExtras = getIntent().getExtras();
        if (intentExtras != null) {
            patient = (Patient) intentExtras.getSerializable(PATIENT);
        }

        try {
            setupPatientMetadata();
            notifyOfIdChange();
        } catch (PatientController.PatientLoadException e) {
            Toast.makeText(this, "An error occurred while fetching patient", Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    private void notifyOfIdChange() {
        final JSONInputOutputToDisk jsonInputOutputToDisk = new JSONInputOutputToDisk(getApplication());
        List list = null;
        try {
            list = jsonInputOutputToDisk.readList();
        } catch (IOException e) {
            Log.e(TAG, "Exception thrown when reading to phone disk", e);
        }
        if(list.size()==0){
            return;
        }

        final String patientIdentifier = patient.getIdentifier();
        if(list.contains(patientIdentifier)){
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setCancelable(true)
                    .setIcon(getResources().getDrawable(R.drawable.ic_warning))
                    .setTitle("Notice")
                    .setMessage("Client Identifier changed on server. The new identifier will be used going forward.")
                    .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            patient.removeIdentifier(Constants.LOCAL_PATIENT);
                            try {
                                jsonInputOutputToDisk.remove(patientIdentifier);
                            } catch (IOException e) {
                                Log.e(TAG, "Error occurred while saving patient which has local identifier removed!", e);
                            }
                        }
                    }).create().show();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        executeBackgroundTask();
    }

    @Override
    protected void onStop() {
        if (mBackgroundQueryTask != null) {
            mBackgroundQueryTask.cancel(true);
        }
        super.onStop();
    }

    private void setupPatientMetadata() throws PatientController.PatientLoadException {

        TextView patientName = (TextView) findViewById(R.id.patientName);
        patientName.setText(PatientAdapterHelper.getPatientFormattedName(patient));

        ImageView genderIcon = (ImageView) findViewById(R.id.genderImg);
        int genderDrawable = patient.getGender().equalsIgnoreCase("M") ? R.drawable.ic_male : R.drawable.ic_female;
        genderIcon.setImageDrawable(getResources().getDrawable(genderDrawable));

        if(patient.getAttribute("Contact Phone Number")!=null) {
            TextView phone = (TextView) findViewById(R.id.phone);
            phone.setText("Tel: "+patient.getAttribute("Contact Phone Number").getAttribute());
        }

        TextView dob = (TextView) findViewById(R.id.dob);
        dob.setText("DOB: " + getFormattedDate(patient.getBirthdate()));

        TextView patientIdentifier = (TextView) findViewById(R.id.patientIdentifier);
        patientIdentifier.setText(patient.getIdentifier());
        ObsInterface.holdIdentifier = patient.getIdentifier();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getSupportMenuInflater().inflate(R.menu.client_summary, menu);
        super.onCreateOptionsMenu(menu);
        return true;
    }

    public void showForms(View v) {
        Intent intent = new Intent(this, PatientFormsActivity.class);
        ConceptsBySearch conceptsBySearch = new
                ConceptsBySearch(((MuzimaApplication) this.getApplicationContext()).getObservationController(),"","");
        intent.putExtra(PATIENT, patient);
        ObsInterface.medicationAddedList.clear();
        ObsInterface.medicationFrequencyList.clear();
        ObsInterface.medicationDoseList.clear();
        ObsInterface.medicationStartDateList.clear();
        ObsInterface.medicationStopDateList.clear();
        if(!conceptsBySearch.ConceptsWithObs("MEDICATION ADDED",patient.getUuid()).isEmpty()){
            int count = conceptsBySearch.ConceptsWithObs("MEDICATION ADDED", patient.getUuid()).size();
            HashMap<Integer,String> medication_added_hashMap = conceptsBySearch.ConceptsWithObs("MEDICATION ADDED", patient.getUuid());
            HashMap<Integer,String> medication_stopped_hashMap = conceptsBySearch.ConceptsWithObs("OTHER MEDICATION PLAN", patient.getUuid());
            HashMap<Integer,String> medication_frequency_hashMap = conceptsBySearch.ConceptsWithObs("MEDICATION FREQUENCY", patient.getUuid());
            HashMap<Integer,String> medication_mg_hashMap = conceptsBySearch.ConceptsWithObs("NUMBER OF MILLIGRAM",patient.getUuid());
            HashMap<Integer,String> medication_start_date = conceptsBySearch.ConceptsWithObs("HISTORICAL DRUG START DATE",patient.getUuid());
            HashMap<Integer,String> medication_stop_date = conceptsBySearch.ConceptsWithObs("HISTORICAL DRUG STOP DATE",patient.getUuid());
            for(int i = count-1; i>=0; i--){
                if(!ObsInterface.medicationAddedList.contains(medication_added_hashMap.get(i))){
                    if((medication_mg_hashMap.get(i)!=null) && (medication_frequency_hashMap.get(i)!=null)){
                        if(medication_stopped_hashMap.get(i)==null) {
                            ObsInterface.medicationAddedList.add(medication_added_hashMap.get(i));
                            ObsInterface.medicationFrequencyList.add(medication_frequency_hashMap.get(i));
                            ObsInterface.medicationDoseList.add(medication_mg_hashMap.get(i));
                            if (medication_start_date.get(i) != null) {
                                ObsInterface.medicationStartDateList.add(medication_start_date.get(i));
                            } else {
                                ObsInterface.medicationStartDateList.add("N/A");
                            }
                            if (medication_start_date.get(i) != null) {
                                ObsInterface.medicationStopDateList.add(medication_stop_date.get(i));
                            } else {
                                ObsInterface.medicationStopDateList.add("N/A");
                            }
                        }else{
                            ObsInterface.medicationStoppedList.add(medication_added_hashMap.get(i));
                            ObsInterface.medicationStoppedFrequencyList.add(medication_frequency_hashMap.get(i));
                            ObsInterface.medicationStoppedDoseList.add(medication_mg_hashMap.get(i));
                            if (medication_start_date.get(i) != null) {
                                ObsInterface.medicationStoppedStartDateList.add(medication_start_date.get(i));
                            } else {
                                ObsInterface.medicationStoppedStartDateList.add("N/A");
                            }
                            if (medication_start_date.get(i) != null) {
                                ObsInterface.medicationStoppedStopDateList.add(medication_stop_date.get(i));
                            } else {
                                ObsInterface.medicationStoppedStopDateList.add("N/A");
                            }
                        }
                    }
                }
            }
        }
        startActivity(intent);
    }

    public void showNotifications(View v) {
        Intent intent = new Intent(this, PatientNotificationActivity.class);
        intent.putExtra(PATIENT, patient);
        startActivity(intent);
    }

    public void showObservations(View v) {
        ObsInterface.showSummary=false;
        Intent intent = new Intent(this, ObservationsActivity.class);
        intent.putExtra(PATIENT, patient);
        startActivity(intent);
    }

    public void showEncounters(View v) {
        Intent intent = new Intent(this, EncountersActivity.class);
        intent.putExtra(PATIENT, patient);
        startActivity(intent);
    }
    public void showSummaries(View v) {
        ObsInterface.showSummary=true;
        Intent intent = new Intent(this, SummaryActivity.class);
        intent.putExtra(PATIENT, patient);
        startActivity(intent);
    }
    public void showMedia(View v) {
        Intent intent = new Intent(this, MediaViewActivity.class);
        ConceptsBySearch conceptsBySearch = new
                ConceptsBySearch(((MuzimaApplication) this.getApplicationContext()).getObservationController(),"","");
        HashMap<Integer,String> imageNames = conceptsBySearch.ConceptsWithObs("CAPTURED CLINICAL MEDIA, IMAGE NAME", patient.getUuid());
        if(!imageNames.isEmpty()){
            String url = APP_MEDIA_DIR + "/image/";
            ObsInterface obsInterface = new ObsInterface();
            File file;
            HashMap<Integer,String> mediaImage = new HashMap<Integer, String>();
            int imageCount = imageNames.size();
            for(int i = imageCount-1; i>=0; i--){
                if(imageNames.get(i)!=null){
                   file= new File(url+imageNames.get(i)+".png");
                    if(!file.exists()){
                        if(mediaImage.isEmpty())
                            mediaImage = conceptsBySearch.ConceptsWithObs("CAPTURED CLINICAL MEDIA, IMAGE", patient.getUuid());
                        obsInterface.bitMapToSd(url+imageNames.get(i)+".png",obsInterface.base64ToBitMap(mediaImage.get(i)));
                    }
                }
            }

        }
        intent.putExtra(PATIENT, patient);

        startActivity(intent);
    }

    private static class PatientSummaryActivityMetadata {
        int recommendedForms;
        int incompleteForms;
        int completeForms;
        int notifications;
        int observations;
        int encounters;
    }

    public class BackgroundQueryTask extends AsyncTask<Void, Void, PatientSummaryActivityMetadata> {

        @Override
        protected PatientSummaryActivityMetadata doInBackground(Void... voids) {
            MuzimaApplication muzimaApplication = (MuzimaApplication) getApplication();
            PatientSummaryActivityMetadata patientSummaryActivityMetadata = new PatientSummaryActivityMetadata();
            FormController formController = muzimaApplication.getFormController();
            NotificationController notificationController = muzimaApplication.getNotificationController();
            ObservationController observationController = muzimaApplication.getObservationController();
            EncounterController encounterController = muzimaApplication.getEncounterController();

            try {
                patientSummaryActivityMetadata.recommendedForms = formController.getRecommendedFormsCount();
                patientSummaryActivityMetadata.completeForms = formController.getCompleteFormsCountForPatient(patient.getUuid());
                patientSummaryActivityMetadata.incompleteForms = formController.getIncompleteFormsCountForPatient(patient.getUuid());
                patientSummaryActivityMetadata.observations = observationController.getObservationsCountByPatient(patient.getUuid());
                patientSummaryActivityMetadata.encounters = encounterController.getEncountersCountByPatient(patient.getUuid());
                User authenticatedUser = ((MuzimaApplication) getApplicationContext()).getAuthenticatedUser();
                if (authenticatedUser != null) {
                    patientSummaryActivityMetadata.notifications =
                            notificationController.getNotificationsCountForPatient(patient.getUuid(), authenticatedUser.getPerson().getUuid(),
                                    Constants.NotificationStatusConstants.NOTIFICATION_UNREAD);
                } else {
                    patientSummaryActivityMetadata.notifications = 0;
                }
            } catch (FormController.FormFetchException e) {
                Log.w(TAG, "FormFetchException occurred while fetching metadata in MainActivityBackgroundTask", e);
            } catch (NotificationController.NotificationFetchException e) {
                Log.w(TAG, "NotificationFetchException occurred while fetching metadata in MainActivityBackgroundTask", e);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return patientSummaryActivityMetadata;
        }

        @Override
        protected void onPostExecute(PatientSummaryActivityMetadata patientSummaryActivityMetadata) {
            TextView formsDescription = (TextView) findViewById(R.id.formDescription);
            formsDescription.setText(patientSummaryActivityMetadata.incompleteForms + " Incomplete, "
                    + patientSummaryActivityMetadata.completeForms + " Complete, "
                    + patientSummaryActivityMetadata.recommendedForms + " Recommended");

            TextView notificationsDescription = (TextView) findViewById(R.id.notificationDescription);
            notificationsDescription.setText(patientSummaryActivityMetadata.notifications + " New Notifications");

            TextView observationDescription = (TextView) findViewById(R.id.observationDescription);
            observationDescription.setText(patientSummaryActivityMetadata.observations + " Observations");

            TextView encounterDescription = (TextView) findViewById(R.id.encounterDescription);
            encounterDescription.setText(patientSummaryActivityMetadata.encounters + " Encounters");
        }
    }

    private void executeBackgroundTask() {
        mBackgroundQueryTask = new BackgroundQueryTask();
        mBackgroundQueryTask.execute();
    }
}