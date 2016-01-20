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
import com.actionbarsherlock.view.Menu;
import com.muzima.R;
import com.muzima.view.BaseActivity;
import com.muzima.view.forms.PeersFormsActivity;

public class PeerNotificationMainActivity extends BaseActivity {
    public static final String PATIENT = "patient";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        startActivity(new Intent(PeerNotificationMainActivity.this, PeersFormsActivity.class));
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getSupportMenuInflater().inflate(R.menu.client_summary, menu);
        super.onCreateOptionsMenu(menu);
        return true;
    }

}