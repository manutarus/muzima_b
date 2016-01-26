/*
 * Copyright (c) 2014. The Trustees of Indiana University.
 *
 * This version of the code is licensed under the MPL 2.0 Open Source license with additional
 * healthcare disclaimer. If the user is an entity intending to commercialize any application
 * that uses this code in a for-profit venture, please contact the copyright holder.
 */

package com.muzima.view.patients;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import com.actionbarsherlock.view.Menu;
import com.muzima.R;
import com.muzima.api.model.Patient;
import com.muzima.utils.ObsInterface;
import com.muzima.view.BaseActivity;
import com.muzima.view.forms.PeersFormsActivity;

public class PeerNotificationMainActivity extends BaseActivity {
    public static final String PATIENT = "patient";
    private Patient patient;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notification_dashboard);
//        Bundle intentExtras = getIntent().getExtras();
//        if (intentExtras != null) {
//            patient = (Patient) intentExtras.getSerializable(PATIENT);
//            ObsInterface.patient = patient;
//        }
//        setDemographics();


    }

    public void setDemographics(){
        ObsInterface.pUUID = patient.getUuid();
        ObsInterface.pMedical_record_number= patient.getIdentifier();
        ObsInterface.pFamily_name= patient.getFamilyName();
        ObsInterface.pGiven_name= patient.getGivenName();
        ObsInterface.pMiddle_name= patient.getMiddleName();
        ObsInterface.pSex= patient.getGender();
        ObsInterface.pBirth_date= patient.getBirthdate().toString();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getSupportMenuInflater().inflate(R.menu.client_summary, menu);
        super.onCreateOptionsMenu(menu);
        return true;
    }

    public void notificationsPatientList(View view) {
        ObsInterface.showCalledPatients = false;
        Intent intent = new Intent(this, PeerNotificationListActivity.class);
        intent.putExtra(PATIENT, ObsInterface.patient);
        startActivity(intent);
    }
    public void notificationsPatientDueList(View view) {
        ObsInterface.showCalledPatients = true;
        Intent intent = new Intent(this, PeerNotificationListActivity.class);
        startActivity(intent);
    }
    public void missedVisitsList(View view) {
        Intent intent = new Intent(this, PatientsListActivity.class);
        startActivity(intent);
    }

}