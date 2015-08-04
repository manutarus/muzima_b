/*
 * Copyright (c) 2014. The Trustees of Indiana University.
 *
 * This version of the code is licensed under the MPL 2.0 Open Source license with additional
 * healthcare disclaimer. If the user is an entity intending to commercialize any application
 * that uses this code in a for-profit venture, please contact the copyright holder.
 */

package com.muzima.model.observation;

import android.util.Base64;
import android.util.Log;
import com.muzima.api.model.Observation;
import com.muzima.utils.ObsInterface;

import java.io.UnsupportedEncodingException;
import java.util.*;

public class Encounters extends ArrayList<EncounterWithObservations> {
    public Encounters() {
    }

    public Encounters(Observation... observations) {
        if(ObsInterface.showSummary) {
            Map<Integer,Observation> treeMap = new TreeMap();
            for (Observation observation : observations) {
                try {
                    Log.i("foundObsValueAsString ", new String(Base64.decode(observation.getValueAsString(), Base64.DEFAULT), "UTF-8"));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (observation.getConcept().getName().contains("INTERNATIONAL NORMALIZED RATIO")) {
                    treeMap.put(1, observation);
                }else if (observation.getConcept().getName().contains("SYSTOLIC BLOOD PRESSURE")) {
                    treeMap.put(2, observation);
                }else if (observation.getConcept().getName().contains("DIASTOLIC BLOOD PRESSURE")) {
                    treeMap.put(3, observation);
                }else if (observation.getConcept().getName().contains("PULSE")) {
                    treeMap.put(4, observation);
                }else if (observation.getConcept().getName().contains("WARFARIN DOSE M")) {
                    treeMap.put(5, observation);
                }else if (observation.getConcept().getName().contains("WARFARIN DOSE TU")) {
                    treeMap.put(6, observation);
                }else if (observation.getConcept().getName().contains("WARFARIN DOSE W")) {
                    treeMap.put(7, observation);
                }else if (observation.getConcept().getName().contains("WARFARIN DOSE TH")) {
                    treeMap.put(8, observation);
                }else if (observation.getConcept().getName().contains("WARFARIN DOSE F")) {
                    treeMap.put(9, observation);
                }else if (observation.getConcept().getName().contains("WARFARIN DOSE SAT")) {
                    treeMap.put(10, observation);
                }else if (observation.getConcept().getName().contains("WARFARIN DOSE SUN")) {
                    treeMap.put(11, observation);
                }else if (observation.getConcept().getName().contains("VITAMIN K DIET(POINTS)")) {
                    treeMap.put(12, observation);
                }else if (observation.getConcept().getName().contains("CONDITIONS REQUIRING ANTICOAGULTION")) {
                    treeMap.put(13, observation);
                }else if (observation.getConcept().getName().contains("DURATION OF ANTICOAGULATION NEEDED, CODED")) {
                    treeMap.put(14, observation);
                }else if (observation.getConcept().getName().contains("ANTICOAGULATION DRUG RESTART DATE")) {
                    treeMap.put(15, observation);
                }else if (observation.getConcept().getName().contains("ANTICOAGULATION DRUG STOP DATE, DUE TO SURGERY")) {
                    treeMap.put(16, observation);
                }else if (observation.getConcept().getName().contains("FAMILY PLANNING METHOD EVER USED")) {
                    treeMap.put(17, observation);
                }else if (observation.getConcept().getName().contains("RETURN VISIT DATE, DISPENSARY")) {
                    treeMap.put(18, observation);
                }
            }
            Set set = treeMap.entrySet();
            Iterator iterator = set.iterator();
            while(iterator.hasNext()) {
                Map.Entry mapEntry = (Map.Entry)iterator.next();
                addObservation(treeMap.get(mapEntry.getKey()));
            }
        }else{
            for (Observation observation : observations) {
                addObservation(observation);
            }

        }
    }

    public Encounters(List<Observation> observationsByPatient) {
        this(observationsByPatient.toArray(new Observation[observationsByPatient.size()]));
    }

    private void addObservation(final Observation observation) {
        EncounterWithObservations encounterWithObservations = getRelatedEncounterWithObservations(observation);
        encounterWithObservations.addObservation(observation);
    }

    private EncounterWithObservations getRelatedEncounterWithObservations(Observation observation) {
        for (EncounterWithObservations current : this) {
            if (current.getEncounter().equals(observation.getEncounter())) {
                return current;
            }
        }
        EncounterWithObservations encounterWithObservations = new EncounterWithObservations();
        add(encounterWithObservations);
        return encounterWithObservations;
    }

    public void sortByDate() {
        Collections.sort(this, new Comparator<EncounterWithObservations>() {
            @Override
            public int compare(EncounterWithObservations lhs, EncounterWithObservations rhs) {
                if (lhs.getEncounter().getEncounterDatetime()==null)
                    return -1;
                if (rhs.getEncounter().getEncounterDatetime()==null)
                    return 1;
                return -(lhs.getEncounter().getEncounterDatetime()
                        .compareTo(rhs.getEncounter().getEncounterDatetime()));
            }
        });

    }
}
