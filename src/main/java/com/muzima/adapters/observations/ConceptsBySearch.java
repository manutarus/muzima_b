/*
 * Copyright (c) 2014. The Trustees of Indiana University.
 *
 * This version of the code is licensed under the MPL 2.0 Open Source license with additional
 * healthcare disclaimer. If the user is an entity intending to commercialize any application
 * that uses this code in a for-profit venture, please contact the copyright holder.
 */

package com.muzima.adapters.observations;

import android.util.Log;
import com.muzima.api.model.Observation;
import com.muzima.controller.ObservationController;
import com.muzima.model.observation.ConceptWithObservations;
import com.muzima.model.observation.Concepts;

import java.util.HashMap;

public class ConceptsBySearch extends ConceptAction {
    private String patientUuid;
    private String term;
    private ObservationController controller;

    public ConceptsBySearch(ObservationController controller, String patientUuid, String term) {
        this.controller = controller;
        this.patientUuid = patientUuid;
        this.term = term;
    }

    @Override
    Concepts get() throws ObservationController.LoadObservationException {
        return controller.searchObservationsGroupedByConcepts(term, patientUuid);
    }

    @Override
    public String toString() {
        return "ConceptsBySearch{" +
                "patientUuid='" + patientUuid + '\'' +
                ", term='" + term + '\'' +
                ", controller=" + controller +
                '}';
    }
    public HashMap<Integer,String> ConceptsWithObs(String term, String patientUuid){
        HashMap<Integer,String> hashMap = new HashMap<Integer,String>();
        try {
            if(!controller.searchObservationsGroupedByConcepts(term, patientUuid).isEmpty()){
                ConceptWithObservations conceptWithObservations = controller.searchObservationsGroupedByConcepts(term, patientUuid).get(0);
                int count = 0;
                for(Observation observation: conceptWithObservations.getObservations()){
                    hashMap.put(count,observation.getValueAsString());
                    count++;
                }
            }
        }
        catch (ObservationController.LoadObservationException olx){
            Log.e("ConceptSearch", "failed to fetch obs " + olx);
        }
        return hashMap;
    }
}
