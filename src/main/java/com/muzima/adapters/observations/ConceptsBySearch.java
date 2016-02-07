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

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
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

    private long daysBetween(Date one, Date two) {
        long difference = (one.getTime()-two.getTime())/86400000; return Math.abs(difference);
    }
    public HashMap<Integer,String> ConceptsWithObsWithinNotification(String term, String patientUuid, int period){
        HashMap<Integer,String> hashMap = new HashMap<Integer,String>();
        try {
            if(!controller.searchObservationsGroupedByConcepts(term, patientUuid).isEmpty()){
                ConceptWithObservations conceptWithObservations = controller.searchObservationsGroupedByConcepts(term, patientUuid).get(0);
                int count = 0;
                DateFormat oldFormatter = new SimpleDateFormat("dd-MM-yyyy");
                SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
                Date todayDate = null;
                String today = sdf.format(new Date());
                DateFormat formatter = new SimpleDateFormat("E MMM dd HH:mm:ss Z yyyy");
                Date obsDate = null;
                for(Observation observation: conceptWithObservations.getObservations()){
                    try {
                        obsDate = formatter.parse(""+observation.getObservationDatetime());
                        todayDate = oldFormatter .parse(today);
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                    if((daysBetween(obsDate,todayDate)<period)) {
                        Log.i("TURN_UP",""+observation.getObservationDatetime());
                        hashMap.put(count, observation.getValueAsString());
                    }
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
