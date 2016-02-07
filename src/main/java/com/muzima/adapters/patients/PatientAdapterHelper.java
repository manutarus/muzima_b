/*
 * Copyright (c) 2014. The Trustees of Indiana University.
 *
 * This version of the code is licensed under the MPL 2.0 Open Source license with additional
 * healthcare disclaimer. If the user is an entity intending to commercialize any application
 * that uses this code in a for-profit venture, please contact the copyright holder.
 */

package com.muzima.adapters.patients;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.muzima.MuzimaApplication;
import com.muzima.R;
import com.muzima.adapters.ListAdapter;
import com.muzima.adapters.observations.ConceptsBySearch;
import com.muzima.api.model.Patient;
import com.muzima.utils.ObsInterface;

import java.awt.*;
import java.util.HashMap;
import java.util.List;

import static com.muzima.utils.DateUtils.getFormattedDate;

public class PatientAdapterHelper extends ListAdapter<Patient> {
    ConceptsBySearch conceptsBySearch= null;
    public PatientAdapterHelper(Context context, int textViewResourceId) {
        super(context, textViewResourceId);
    }

    public View createPatientRow(Patient patient, View convertView, ViewGroup parent, Context context) {
        ViewHolder holder;
        if (convertView == null) {
            LayoutInflater layoutInflater = LayoutInflater.from(context);
            convertView = layoutInflater.inflate(R.layout.item_patients_list_multi_checkable, parent, false);
            holder = new ViewHolder();
            holder.genderImg = (ImageView) convertView.findViewById(R.id.genderImg);
            holder.name = (TextView) convertView.findViewById(R.id.name);
            holder.dateOfBirth = (TextView) convertView.findViewById(R.id.dateOfBirth);
            holder.identifier = (TextView) convertView.findViewById(R.id.identifier);
            holder.phone = (TextView) convertView.findViewById(R.id.phone);
            if(ObsInterface.showNotification){
                if(patient.getAttribute("called")!=null){
                    holder.genderImg.setBackgroundColor(0xff0000ff);
                    holder.name.setBackgroundColor(0xff0000ff);
                    holder.dateOfBirth.setBackgroundColor(0xff0000ff);
                    holder.identifier.setBackgroundColor(0xff0000ff);
                    holder.phone.setBackgroundColor(0xff0000ff);
                    convertView.setBackgroundColor(0xff0000ff);

                }
            }
            convertView.setTag(holder);
        }

        holder = (ViewHolder) convertView.getTag();
        holder.dateOfBirth.setText("DOB: " + getFormattedDate(patient.getBirthdate()));
        holder.identifier.setText(patient.getIdentifier());
        if(patient.getAttribute("Contact Phone Number")!=null) {
            holder.phone.setText("Tel2: "+patient.getAttribute("Contact Phone Number").getAttribute());
        }
        if(patient.getAttribute("Contact Phone Number")==null && patient.getAttribute("Alternative contact phone number")!=null) {
            holder.phone.setText("Alt: "+patient.getAttribute("Alternative contact phone number").getAttribute());
        }
        holder.name.setText(getPatientFullName(patient));
        holder.genderImg.setImageResource(getGenderImage(patient.getGender()));
        return convertView;
    }

    public void onPreExecute(BackgroundListQueryTaskListener backgroundListQueryTaskListener) {
        if (backgroundListQueryTaskListener != null) {
            backgroundListQueryTaskListener.onQueryTaskStarted();
        }
    }

    public void onPostExecute(List<Patient> patients, ListAdapter searchAdapter, BackgroundListQueryTaskListener backgroundListQueryTaskListener) {
        if (patients == null) {
            Toast.makeText(getContext(), "Something went wrong while fetching patients from local repo", Toast.LENGTH_SHORT).show();
            return;
        }

        searchAdapter.clear();
        searchAdapter.addAll(patients);
        searchAdapter.notifyDataSetChanged();

        if (backgroundListQueryTaskListener != null) {
            backgroundListQueryTaskListener.onQueryTaskFinish();
        }
    }

    public static String getPatientFormattedName(Patient patient){
        StringBuffer patientFormattedName = new StringBuffer();
        if(patient.getFamilyName()!=null) {
            patientFormattedName.append(patient.getFamilyName());
            patientFormattedName.append(", ");
        }
        if(patient.getGivenName() != null){
            patientFormattedName.append(patient.getGivenName().substring(0,1));
            patientFormattedName.append(" ");
        }
        if(patient.getMiddleName() != null){
            patientFormattedName.append(patient.getMiddleName().substring(0,1));
        }
        return patientFormattedName.toString();
    }

    private String getPatientFullName(Patient patient) {
        String patientMiddleName="";
        if (patient.getMiddleName()!=null){
            patientMiddleName = patient.getMiddleName();
        }
        return patient.getFamilyName() + ", " + patient.getGivenName() + " " + patientMiddleName;
    }

    private int getGenderImage(String gender) {
        return gender.equalsIgnoreCase("M") ? R.drawable.ic_male : R.drawable.ic_female;
    }

    @Override
    public void reloadData() {
    }

    private class ViewHolder {
        ImageView genderImg;
        TextView name;
        TextView dateOfBirth;
        TextView identifier;
        TextView phone;
    }
}
