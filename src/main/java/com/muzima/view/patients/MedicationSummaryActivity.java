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
import android.view.Gravity;
import android.view.View;
import android.widget.*;
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
import com.muzima.utils.MediaUtils;
import com.muzima.utils.ObsInterface;
import com.muzima.view.BaseActivity;
import com.muzima.view.encounters.EncountersActivity;
import com.muzima.view.forms.PatientFormsActivity;
import com.muzima.view.notifications.PatientNotificationActivity;

import java.awt.*;
import java.awt.Button;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import static com.muzima.utils.DateUtils.getFormattedDate;

public class MedicationSummaryActivity extends BaseActivity {
    private static final String TAG = "PatientSummaryActivity";
    public static final String PATIENT = "patient";
    private Patient patient;
    TableLayout table_layout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_drug_summary);
        Bundle intentExtras = getIntent().getExtras();
        if (intentExtras != null) {
            patient = (Patient) intentExtras.getSerializable(PATIENT);
            ObsInterface.patient = patient;
        }

        try {
            setupPatientMetadata();
            notifyOfIdChange();
            table_layout = (TableLayout) findViewById(R.id.currentMedicationLayout);
            BuildTable();
        } catch (PatientController.PatientLoadException e) {
            Toast.makeText(this, "An error occurred while fetching patient", Toast.LENGTH_SHORT).show();
            finish();
        }

    }



    private void BuildTable() {
//        int cols=15;
        ConceptsBySearch conceptsBySearch = new
                ConceptsBySearch(((MuzimaApplication) this.getApplicationContext()).getObservationController(),"","");

        TableRow row = new TableRow(this);
        row.setLayoutParams(new TableLayout.LayoutParams(TableRow.LayoutParams.MATCH_PARENT,
                TableRow.LayoutParams.WRAP_CONTENT));
        Log.i("found_meds", conceptsBySearch.ConceptsWithObs("MEDICATION ADDED",patient.getUuid()).get(0));

        if(!conceptsBySearch.ConceptsWithObs("MEDICATION ADDED",patient.getUuid()).isEmpty()){
            HashMap<Integer,String> medication_added_hashMap = conceptsBySearch.ConceptsWithObs("MEDICATION ADDED", patient.getUuid());
            HashMap<Integer,String> medication_frequency_hashMap = conceptsBySearch.ConceptsWithObs("MEDICATION FREQUENCY", patient.getUuid());
            HashMap<Integer,String> medication_mg_hashMap = conceptsBySearch.ConceptsWithObs("NUMBER OF MILLIGRAM",patient.getUuid());
            HashMap<Integer,String> medication_start_date = conceptsBySearch.ConceptsWithObs("HISTORICAL DRUG START DATE",patient.getUuid());
            HashMap<Integer,String> medication_stop_date = conceptsBySearch.ConceptsWithObs("HISTORICAL DRUG STOP DATE",patient.getUuid());

            int countCurrent;
            if(medication_stop_date != null){
                countCurrent = medication_start_date.size() - medication_stop_date.size();
            }else{
                countCurrent = medication_start_date.size();
            }
            Log.i("found_meds_count", ""+countCurrent);

            for(int i = countCurrent-1; i>=0; i--){
                if(medication_stop_date.get(i)==null){
                    TextView tvMed = new TextView(this);
                    tvMed.setLayoutParams(new TableRow.LayoutParams(TableRow.LayoutParams.WRAP_CONTENT,
                            TableRow.LayoutParams.WRAP_CONTENT));
                    tvMed.setBackgroundResource(R.drawable.cell_shape);
                    tvMed.setGravity(Gravity.CENTER);
                    if(i%2>0){
                        tvMed.setTextColor(getResources().getColor(R.color.med_text_color));
                    }else{
                        tvMed.setTextColor(getResources().getColor(R.color.medTwo_text_color));
                    }
                    tvMed.setText("\n " + medication_added_hashMap.get(i) + " \n" + medication_mg_hashMap.get(i) + " mg - " + medication_frequency_hashMap.get(i)+" \nStart Date: "+medication_start_date.get(i)+" \n");
                    row.addView(tvMed);

                }
            }


        }

        table_layout.addView(row);
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
        if(patient.getAttribute("Alternative contact phone number")!=null) {
            TextView phone = (TextView) findViewById(R.id.alternate_phone);
            phone.setText(patient.getAttribute("Relationship to phone number owner").getAttribute()+": "+patient.getAttribute("Alternative contact phone number").getAttribute());
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

}