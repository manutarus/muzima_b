package com.muzima.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * User: manu
 * Date: 15/01/15
 * Time: 22:52
 */
public class ObsInterface {
    public static List<String> medicationAddedList = new ArrayList<String>();
    public static List<String> medicationStoppedList = new ArrayList<String>();
    public static List<String> medicationFrequencyList = new ArrayList<String>();
    public static List<String> medicationStoppedFrequencyList = new ArrayList<String>();
    public static List<String> medicationDoseList = new ArrayList<String>();
    public static List<String> medicationStoppedDoseList = new ArrayList<String>();
    public static List<String> medicationStartDateList = new ArrayList<String>();
    public static List<String> medicationStoppedStartDateList = new ArrayList<String>();
    public static List<String> medicationStopDateList = new ArrayList<String>();
    public static List<String> medicationStoppedStopDateList = new ArrayList<String>();
    public static byte[] fingerprintResultBytes;
    public static boolean showSummary = false;
    public static String holdIdentifier = null;

}
