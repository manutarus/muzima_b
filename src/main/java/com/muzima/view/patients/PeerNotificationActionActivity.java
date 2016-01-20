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
import com.muzima.api.model.PatientIdentifier;
import com.muzima.api.model.User;
import com.muzima.controller.*;
import com.muzima.service.JSONInputOutputToDisk;
import com.muzima.utils.Constants;
import com.muzima.utils.MediaUtils;
import com.muzima.utils.ObsInterface;
import com.muzima.view.BaseActivity;
import com.muzima.view.encounters.EncountersActivity;
import com.muzima.view.forms.PatientFormsActivity;
import com.muzima.view.forms.PeersFormsActivity;
import com.muzima.view.forms.RegistrationFormsActivity;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import static com.muzima.utils.DateUtils.getFormattedDate;

public class PeerNotificationActionActivity extends BaseActivity {
    public static final String PATIENT = "patient";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        startActivity(new Intent(PeerNotificationActionActivity.this, PeersFormsActivity.class));
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getSupportMenuInflater().inflate(R.menu.client_summary, menu);
        super.onCreateOptionsMenu(menu);
        return true;
    }

}