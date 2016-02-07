/*
 * Copyright (c) 2014. The Trustees of Indiana University.
 *
 * This version of the code is licensed under the MPL 2.0 Open Source license with additional
 * healthcare disclaimer. If the user is an entity intending to commercialize any application
 * that uses this code in a for-profit venture, please contact the copyright holder.
 */

package com.muzima.view.patients;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.*;
import com.actionbarsherlock.view.Menu;
import com.actionbarsherlock.view.MenuItem;
import com.actionbarsherlock.widget.SearchView;
import com.futronictech.SDKHelper.UsbDeviceDataExchangeImpl;
import com.muzima.MuzimaApplication;
import com.muzima.R;
import com.muzima.adapters.ListAdapter;
import com.muzima.adapters.patients.PatientsLocalSearchAdapter;
import com.muzima.api.model.Cohort;
import com.muzima.api.model.Patient;
import com.muzima.api.model.User;
import com.muzima.controller.CohortController;
import com.muzima.search.api.util.StringUtil;
import com.muzima.utils.Fonts;
import com.muzima.utils.NetworkUtils;
import com.muzima.utils.ObsInterface;
import com.muzima.utils.barcode.IntentIntegrator;
import com.muzima.utils.barcode.IntentResult;
import com.muzima.view.BroadcastListenerActivity;
import com.muzima.view.forms.RegistrationFormsActivity;
import com.muzima.view.notifications.SyncNotificationsIntent;

import java.util.ArrayList;
import java.util.List;

import static android.view.View.INVISIBLE;
import static android.view.View.VISIBLE;
import static com.muzima.utils.Constants.DataSyncServiceConstants;
import static com.muzima.utils.Constants.DataSyncServiceConstants.SyncStatusConstants;
import static com.muzima.utils.Constants.SEARCH_STRING_BUNDLE_KEY;

public class PeerNotificationListActivity extends BroadcastListenerActivity implements AdapterView.OnItemClickListener, ListAdapter.BackgroundListQueryTaskListener {
    public static final String COHORT_ID = "cohortId";
    public static final String COHORT_NAME = "cohortName";
    public static final String QUICK_SEARCH = "quickSearch";
    public static final String NOTIFICATIONS = "Notifications";
    public static boolean isNotificationsList = false;
    private MenuItem menubarSyncButton;

    private ListView listView;
    private boolean quickSearch = false;
    private String cohortId = null;

    private PatientsLocalSearchAdapter patientAdapter;
    private FrameLayout progressBarContainer;
    private View noDataView;
    private String searchString;
    private Button searchServerBtn;
    private SearchView searchView;
    private boolean intentBarcodeResults = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ObsInterface.showNotification = true;
        setContentView(R.layout.activity_patient_list);
        Bundle intentExtras = getIntent().getExtras();
        if (intentExtras != null) {
            quickSearch = intentExtras.getBoolean(QUICK_SEARCH);
            cohortId = intentExtras.getString(COHORT_ID);
            String title = intentExtras.getString(COHORT_NAME);
            if (title != null) {
                isNotificationsList = StringUtil.equals(title, NOTIFICATIONS);
                setTitle(title);
            }
        } else
            isNotificationsList = false;

        progressBarContainer = (FrameLayout) findViewById(R.id.progressbarContainer);
        setupNoDataView();
        setupListView(cohortId);


    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getSupportMenuInflater().inflate(R.menu.client_list, menu);
        searchView = (SearchView) menu.findItem(R.id.search)
                .getActionView();
        searchView.setQueryHint("Search clients");
        super.onCreateOptionsMenu(menu);
        return true;
    }



    @Override
    protected void onResume() {
        super.onResume();
        if (!intentBarcodeResults)
            patientAdapter.reloadData();
    }

    private void setupListView(String cohortId) {
        listView = (ListView) findViewById(R.id.list);
        listView.setEmptyView(findViewById(R.id.no_data_layout));
        patientAdapter = new PatientsLocalSearchAdapter(getApplicationContext(),
                R.layout.layout_list,
                ((MuzimaApplication) getApplicationContext()).getPatientController(),
                cohortId, isNotificationsList);
        patientAdapter.setBackgroundListQueryTaskListener(this);
        listView.setAdapter(patientAdapter);
        listView.setOnItemClickListener(this);
    }

    private void setupNoDataView() {

        noDataView = findViewById(R.id.no_data_layout);

        TextView noDataMsgTextView = (TextView) findViewById(R.id.no_data_msg);
        if (isNotificationsList)
            noDataMsgTextView.setText(getResources().getText(R.string.no_notification_available));
        else
            noDataMsgTextView.setText(getResources().getText(R.string.no_clients_matched_locally));

        TextView noDataTipTextView = (TextView) findViewById(R.id.no_data_tip);

        if (isNotificationsList)
            noDataTipTextView.setText(R.string.no_notification_available_tip);
        else
            noDataTipTextView.setText(R.string.no_clients_matched_tip_locally);

        noDataMsgTextView.setTypeface(Fonts.roboto_bold_condensed(this));
        noDataTipTextView.setTypeface(Fonts.roboto_light(this));
    }

    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int position, long l) {
        Patient patient = patientAdapter.getItem(position);
        Intent intent = new Intent(this, PeerNotificationActionActivity.class);
        intent.putExtra(PatientSummaryActivity.PATIENT, patient);
        startActivity(intent);
        setDemographics(patient);
    }

    public void setDemographics(Patient patient){
        ObsInterface.pUUID = patient.getUuid();
        ObsInterface.pMedical_record_number= patient.getIdentifier();
        ObsInterface.pFamily_name= patient.getFamilyName();
        ObsInterface.pGiven_name= patient.getGivenName();
        ObsInterface.pMiddle_name= patient.getMiddleName();
        ObsInterface.pSex= patient.getGender();
        ObsInterface.pBirth_date= patient.getBirthdate().toString();
    }

    @Override
    public void onQueryTaskStarted() {
        listView.setVisibility(INVISIBLE);
        noDataView.setVisibility(INVISIBLE);
        progressBarContainer.setVisibility(VISIBLE);
    }

    @Override
    public void onQueryTaskFinish() {

        listView.setVisibility(VISIBLE);
        progressBarContainer.setVisibility(INVISIBLE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent dataIntent) {

        IntentResult scanningResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, dataIntent);
        if (scanningResult != null) {
            intentBarcodeResults = true;
            searchView.setQuery(scanningResult.getContents(), false);

        }

    }


}