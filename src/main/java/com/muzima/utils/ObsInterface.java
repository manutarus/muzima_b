package com.muzima.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;
import com.muzima.api.model.Patient;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * User: manu
 * Date: 15/01/15
 * Time: 22:52
 */
public class ObsInterface {
    public static String currentPhoneNumber = new String();
    public static String currentCareLocation = new String();
    public static Patient patient = new Patient();
    public static List<String> medicationAddedList = new ArrayList<String>();
    public static List<String> medicationStoppedList = new ArrayList<String>();
    public static List<String> medicationFrequencyList = new ArrayList<String>();
    public static List<String> medicationStoppedFrequencyList = new ArrayList<String>();
    public static List<String> medicationDoseList = new ArrayList<String>();
    public static List<String> medicationStoppedDoseList = new ArrayList<String>();
    public static List<String> medicationStartDateList = new ArrayList<String>();
    public static List<String> medicationStoppedStartDateList = new ArrayList<String>();
    public static List<String> medicationStoppedStopDateList = new ArrayList<String>();
    public static List<String> patientIdTypes = new ArrayList<String>();
    public static List<String> patientIdValues = new ArrayList<String>();
    public static List<String> sideEffectsList = new ArrayList<String>();
    public static byte[] fingerprintResultBytes;
    public static String base64Image;
    public static boolean showSummary = false;
    public static boolean showNotification = false;
    public static boolean registration = false;
    public static String holdIdentifier = null;

    public static String bitMapToBase64(Bitmap bitmapImage)
    {
        Bitmap bitmap = bitmapImage;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
        byte[] b = baos.toByteArray();
        String base64Image = Base64.encodeToString(b, Base64.DEFAULT);
        return base64Image;
    }
    public static Bitmap base64ToBitMap(String base64Image)
    {
        byte[] decodedByte = Base64.decode(base64Image, 0);
        return BitmapFactory.decodeByteArray(decodedByte, 0, decodedByte.length);
    }

    public void bitMapToSd(String filename,Bitmap bmp) {
        try {
            FileOutputStream out = new FileOutputStream(filename);
            bmp.compress(Bitmap.CompressFormat.PNG, 100, out);
            out.flush();
            out.close();
        } catch(Exception e) {}
    }

}
