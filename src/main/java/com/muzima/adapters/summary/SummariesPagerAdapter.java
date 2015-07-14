/*
 * Copyright (c) 2014. The Trustees of Indiana University.
 *
 * This version of the code is licensed under the MPL 2.0 Open Source license with additional
 * healthcare disclaimer. If the user is an entity intending to commercialize any application
 * that uses this code in a for-profit venture, please contact the copyright holder.
 */

package com.muzima.adapters.summary;

import android.content.Context;
import android.support.v4.app.FragmentManager;
import com.actionbarsherlock.widget.SearchView;
import com.muzima.MuzimaApplication;
import com.muzima.adapters.MuzimaPagerAdapter;
import com.muzima.controller.ObservationController;
import com.muzima.view.observations.SummaryByEncountersFragment;
import com.muzima.view.patients.ObservationsListFragment;

public class SummariesPagerAdapter extends MuzimaPagerAdapter implements SearchView.OnQueryTextListener {

    public SummariesPagerAdapter(Context applicationContext, FragmentManager supportFragmentManager) {
        super(applicationContext,supportFragmentManager);
    }

    @Override
    public void initPagerViews() {
        pagers = new PagerView[1];
        ObservationController observationController = ((MuzimaApplication) context.getApplicationContext()).getObservationController();
        ObservationsListFragment observationByEncountersFragment = SummaryByEncountersFragment.newInstance(observationController);
        pagers[0] = new PagerView("Patient Summary", observationByEncountersFragment);

    }

    @Override
    public boolean onQueryTextSubmit(String query) {
        return onQueryTextChange(query);
    }

    @Override
    public boolean onQueryTextChange(String newText) {
        for (PagerView pager : pagers) {
            ((ObservationsListFragment)pager.fragment).onSearchTextChange(newText);
        }
        return false;
    }
}
