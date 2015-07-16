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
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.actionbarsherlock.view.Menu;
import com.muzima.R;
import com.muzima.adapters.patients.PatientAdapterHelper;
import com.muzima.api.model.Patient;
import com.muzima.controller.PatientController;
import com.muzima.service.JSONInputOutputToDisk;
import com.muzima.utils.Constants;
import com.muzima.utils.Fonts;
import com.muzima.utils.ObsInterface;
import com.muzima.view.BaseActivity;
import org.joda.time.format.DateTimeFormat;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.muzima.utils.DateUtils.getFormattedDate;

public class MediaViewActivity extends BaseActivity {
    private static final String TAG = "PatientSummaryActivity";
    public static final String PATIENT = "patient";
    private static final String APP_EXTERNAL_DIR_ROOT =  Environment.getExternalStorageDirectory().getPath() + "/muzima";
    public static final String APP_MEDIA_DIR = APP_EXTERNAL_DIR_ROOT + "/media";

//    private BackgroundQueryTask mBackgroundQueryTask;

    private Patient patient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_media_view);

        Bundle intentExtras = getIntent().getExtras();
        if (intentExtras != null) {
            patient = (Patient) intentExtras.getSerializable(PATIENT);
        }

        try {
            setupPatientMetadata();
            notifyOfIdChange();
        } catch (PatientController.PatientLoadException e) {
            Toast.makeText(this, "An error occurred while fetching patient", Toast.LENGTH_SHORT).show();
            finish();
        }
        ViewGroup linearLayout = (ViewGroup) findViewById(R.id.media);

        Button[] dynamic_button = new Button[10];
        int counter =0;
        boolean dataAvailable = false;
        for(final String arrayList: getFileNames(GetFiles())){
            if(arrayList.endsWith(".png") && arrayList.startsWith(ObsInterface.holdIdentifier)){
                dataAvailable = true;
                String[] arraySplit = arrayList.split("_");
                String date =DateTimeFormat.forPattern("dd-MM-yyyy").print(DateTimeFormat.forPattern("yyyyMMdd").parseLocalDate(arraySplit[2]));
                String text = "Category   : "+ arraySplit[1] +"\n" +
                         "Date taken: "+date+"\n";
                dynamic_button[counter] = new Button(this);
                dynamic_button[counter].setId(counter);
                dynamic_button[counter].setTag("" + counter);
                dynamic_button[counter].setText(text);
                linearLayout.addView(dynamic_button[counter]);
                dynamic_button[counter].setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        String url = APP_MEDIA_DIR + "/image/" +arrayList;
                        Intent intent = new Intent();
                        intent.setAction(Intent.ACTION_VIEW);
                        intent.setDataAndType(Uri.parse("file://" + url), "image/*");
                        startActivity(intent);
                    }
                });
                counter++;
            }
        }
        if(!dataAvailable){

            TextView noDataMsgTextView = (TextView) findViewById(R.id.no_media_msg);
            noDataMsgTextView.setText(getResources().getText(R.string.no_media_available));
            noDataMsgTextView.setTypeface(Fonts.roboto_bold_condensed(this));

        }
    }

    private void notifyOfIdChange() {
        final JSONInputOutputToDisk jsonInputOutputToDisk = new JSONInputOutputToDisk(getApplication());
        List list = null;
        try {
            list = jsonInputOutputToDisk.readList();
        } catch (IOException e) {
            Log.e(TAG, "Exception thrown when reading to phone disk", e);
        }
        if(list.size()==0){
            return;
        }

        final String patientIdentifier = patient.getIdentifier();
        if(list.contains(patientIdentifier)){
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setCancelable(true)
                    .setIcon(getResources().getDrawable(R.drawable.ic_warning))
                    .setTitle("Notice")
                    .setMessage("Client Identifier changed on server. The new identifier will be used going forward.")
                    .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            patient.removeIdentifier(Constants.LOCAL_PATIENT);
                            try {
                                jsonInputOutputToDisk.remove(patientIdentifier);
                            } catch (IOException e) {
                                Log.e(TAG, "Error occurred while saving patient which has local identifier removed!", e);
                            }
                        }
                    }).create().show();
        }
    }



    private void setupPatientMetadata() throws PatientController.PatientLoadException {

        TextView patientName = (TextView) findViewById(R.id.patientName);
        patientName.setText(PatientAdapterHelper.getPatientFormattedName(patient));

        ImageView genderIcon = (ImageView) findViewById(R.id.genderImg);
        int genderDrawable = patient.getGender().equalsIgnoreCase("M") ? R.drawable.ic_male : R.drawable.ic_female;
        genderIcon.setImageDrawable(getResources().getDrawable(genderDrawable));

        if(patient.getAttribute("Contact Phone Number")!=null) {
            TextView phone = (TextView) findViewById(R.id.phone);
            phone.setText("Tel: "+patient.getAttribute("Contact Phone Number").getAttribute());
        }

        TextView dob = (TextView) findViewById(R.id.dob);
        dob.setText("DOB: " + getFormattedDate(patient.getBirthdate()));

        TextView patientIdentifier = (TextView) findViewById(R.id.patientIdentifier);
        patientIdentifier.setText(patient.getIdentifier());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getSupportMenuInflater().inflate(R.menu.client_summary, menu);
        super.onCreateOptionsMenu(menu);
        return true;
    }

    public File[] GetFiles() {
        String url = APP_MEDIA_DIR + "/image/";
        File f = new File(url);
        f.mkdirs();
        File[] file = f.listFiles();
        return file;
    }

    public ArrayList<String> getFileNames(File[] file){
        ArrayList<String> arrayFiles = new ArrayList<String>();
        if (file.length == 0)
            return null;
        else {
            for (int i=0; i<file.length; i++)
                arrayFiles.add(file[i].getName());
        }

        return arrayFiles;
    }


}