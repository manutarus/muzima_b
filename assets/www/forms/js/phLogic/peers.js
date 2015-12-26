$(document).ready(function () {
    var age = ""+$.fn.getAgeInYears($('#patient\\.birth_date').val());
    var yearsMonths = age.split('.');
    $('#age').val(yearsMonths[0] +" Years");
    var dateFormat = "dd-mm-yy";
    var currentDate = $.datepicker.formatDate(dateFormat, new Date());
    var encounterDatetime = $('#encounter\\.encounter_datetime');
    if ($(encounterDatetime).val() == "") {
        $(encounterDatetime).val(currentDate);
    }

    $('#save_draft').click(function () {
        $(this).prop('disabled', true);
        document.saveDraft(this);
        $(this).prop('disabled', false);
    });

    $('#submit_form').click(function () {
        $(this).prop('disabled', true);
        document.submit();
        $(this).prop('disabled', false);
    });

    //Toggle Display when YES/inpatient/No is selected
    var $yesSelect = $('.yesSelect');
    $yesSelect.change(function () {
        var $yesSectionToShow = $(this).closest('.section').find('.yesSectionToShow');
        var $knownSectionToShow = $(this).closest('.section').find('.knownSectionToShow');
        var $noSectionToShow = $(this).closest('.inline').find('.arvSectionToShow');
        var $patientTypeSectionToShow = $(this).closest('.section').find('.patientTypeSectionToShow');
        var divToShowVal = $(this).val();
        if (divToShowVal  == '5622^OTHER NON-CODED^99DCT') {
            if(($(this).is(':checked'))){
                $yesSectionToShow.show();
            }
            else{
                $yesSectionToShow.hide();
            }
        }else if (divToShowVal  == '1065^YES^99DCT') {
            if(($(this).is(':checked'))){
                $knownSectionToShow.show();
            }
            else{
                $knownSectionToShow.hide();
            }
        }else if (divToShowVal  == '1066^NO^99DCT') {
            if(($(this).is(':checked'))){
                $noSectionToShow.show();
                $yesSectionToShow.hide();
                $knownSectionToShow.hide();

            }
            else{
                $noSectionToShow.hide();
            }
        }else if (divToShowVal  == '5485^INPATIENT CARE OR HOSPITALIZATION^99DCT') {
            if(($(this).is(':checked'))){
                $patientTypeSectionToShow.show();
            }
            else{
                $yesSectionToShow.hide();
            }
        }else {
            $yesSectionToShow.hide();
            $patientTypeSectionToShow.hide();
            $noSectionToShow.hide();
            $knownSectionToShow.hide();
        }
    });$yesSelect.trigger('change');

    var $toggleLocation = $('.toggleLocation');
    $toggleLocation.change(function () {
        var $toggleLocationDivOne = $(this).closest('.section').find('.toggleLocationDivOne');
        var $toggleLocationDivTwo= $(this).closest('.section').find('.toggleLocationDivTwo');
        var divToShowVal = $(this).val();
        if (divToShowVal  == '5622^OTHER NON-CODED^99DCT') {
            if(($(this).is(':checked'))){
                $toggleLocationDivOne.show();
            }
            else{
                $toggleLocationDivOne.hide();
            }
        }else if (divToShowVal  == '1065^YES^99DCT') {
            if(($(this).is(':checked'))){
                $toggleLocationDivTwo.show();
            }
            else{
                $toggleLocationDivTwo.hide();
            }
        }else {
            $toggleLocationDivOne.hide();
            $toggleLocationDivTwo.hide();
        }
    });$toggleLocation.trigger('change');

    var $arvSelect = $('.arvSelect');
    $arvSelect.change(function () {
        var $yesSectionToShow = $(this).closest('.section').find('.arvSelectToShow');
        var divToShowVal = $(this).val();
        if (divToShowVal  == '1065^YES^99DCT') {
            if(($(this).is(':checked'))){
                $yesSectionToShow.show();
            }
            else{
                $yesSectionToShow.hide();
            }
        }else{
            $yesSectionToShow.hide();
        }
    });$arvSelect.trigger('change');

    var arvDrugs = [
        {"val": "635^NELFINAVIR^99DCT", "label": "Nelfinavir"},
        {"val": "792^STAVUDINE LAMIVUDINE AND NEVIRAPINE^99DCT", "label": "Stavudine lamivudine and nevirapine"},
        {"val": "625^STAVUDINE^99DCT", "label": "Stavudine"},
        {"val": "796^DIDANOSINE^99DCT", "label": "DDI 125 (Didanosine)"},
        {"val": "6157^DARUNAVIR^99DCT", "label": "Darunavir"},
        {"val": "792^STAVUDINE LAMIVUDINE AND NEVIRAPINE^99DCT", "label": "Triomune-40"},
        {"val": "6159^DIDANOSINE^99DCT", "label": "Atazanavir"},
        {"val": "6158^ETRAVIRINE^99DCT", "label": "Etravirine"},
        {"val": "817^RITONAVIR^99DCT", "label": "Ritonavir"},
        {"val": "817^ABACAVIR LAMIVUDINE AND ZIDOVUDINE^99DCT", "label": "Ritonavir"},
        {"val": "631^NEVIRAPINE^99DCT", "label": "Nevirapine"},
        {"val": "628^LAMIVUDINE^99DCT", "label": "Lamivudine"},
        {"val": "797^ZIDOVUDINE^99DCT", "label": "Zidovudine"},
        {"val": "625^STAVUDINE^99DCT", "label": "d4T-30 (Stavudine)"},
        {"val": "814^ABACAVIR^99DCT", "label": "Abacavir"},
        {"val": "794^LOPINAVIR AND RITONAVIR ^99DCT", "label": "Lopinavir and Ritonavir"},
        {"val": "802^TENOFOVIR^99DCT", "label": "Tenofovir"},
        {"val": "1400^LAMIVUDINE AND TENOFOVIR^99DCT", "label": "Lamivudine and Renofovir"},
        {"val": "6180^EMTRICITABINE AND TENOFOVIR^99DCT", "label": "Emtricitabine and Tenofovir"},
        {"val": "791^INDINAVIR^99DCT", "label": "Indinavir"},
        {"val": "791^EMTRICITABINE^99DCT", "label": "Emtricitabine"},
        {"val": "6467^NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE^99DCT", "label": "Nevirapine Lamivudine and Zidovudine"},
        {"val": "972^STAVUDINE LAMIVUDINE AND NEVIRAPINE^99DCT", "label": "Triomune-30 (Stavudine Lamivudine and Nevirapine)"},
        {"val": "633^EFAVIRENZ^99DCT", "label": "Efavirenz"},
        {"val": "6965^LAMIVUDINE AND STAVUDINE^99DCT", "label": "3TC 150 and D4T 30 (Lamivudine and Stavudine)"},
        {"val": "6964^TENOFOVIR AND LAMIVUDINE AND EFAVIRENZ^99DCT", "label": "TDF 300 AND 3TC 300 AND EFV 600 (TENOFOVIR AND LAMIVUDINE AND EFAVIRENZ)"},
        {"val": "6679^ABACAVIR AND LAMIVUDINE^99DCT", "label": "Abacavir and Lamivudine"},
        {"val": "630^ZIDOVUDINE AND LAMIVUDINE^99DCT", "label": "Zidovudine and Lamivudine"},
        {"val": "792^STAVUDINE LAMIVUDINE AND NEVIRAPINE^99DCT", "label": "Triomune-15 (STAVUDINE LAMIVUDINE AND NEVIRAPINE)"},
        {"val": "792^STAVUDINE LAMIVUDINE AND NEVIRAPINE^99DCT", "label": "Triomune-20 (STAVUDINE LAMIVUDINE AND NEVIRAPINE)"},
        {"val": "792^STAVUDINE LAMIVUDINE AND NEVIRAPINE^99DCT", "label": "DDI 400 EC (DIDANOSINE)"},
        {"val": "796^DIDANOSINE^99DCT", "label": "DDI 400 EC (DIDANOSINE)"},
        {"val": "796^DIDANOSINE^99DCT", "label": "DDI 250 EC (DIDANOSINE)"},
        {"val": "792^STAVUDINE LAMIVUDINE AND NEVIRAPINE^99DCT", "label": "Triomune-Junior (STAVUDINE LAMIVUDINE AND NEVIRAPINE)"},
        {"val": "6467^NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE^99DCT", "label": "3TC 30 and NVP 50 and ZDV 60 (NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE)"},
        {"val": "6467^NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE^99DCT", "label": "NVP 200 and 3TC 150 and ZDV 300 (NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE)"},
        {"val": "631^NEVIRAPINE^99DCT", "label": "Nevirapine 200mg (NEVIRAPINE)"},
        {"val": "628^LAMIVUDINE^99DCT", "label": "Lamivudine 150mg (LAMIVUDINE)"},
        {"val": "797^ZIDOVUDINE^99DCT", "label": "Zidovudine 300mg (ZIDOVUDINE)"},
        {"val": "625^STAVUDINE^99DCT", "label": "Stavudine 30mg (STAVUDINE)"},
        {"val": "814^ABACAVIR^99DCT", "label": "Abacavir 300mg (ABACAVIR)"},
        {"val": "794^LOPINAVIR AND RITONAVIR^99DCT", "label": "LPV 200 and RIT 50 (LOPINAVIR AND RITONAVIR)"},
        {"val": "802^TENOFOVIR^99DCT", "label": "TENOFOVIR"},
        {"val": "6180^EMTRICITABINE AND TENOFOVIR^99DCT", "label": "EMTRICITABINE 200 and TENOFOVIR 300 (EMTRICITABINE AND TENOFOVIR)"},
        {"val": "633^EFAVIRENZ^99DCT", "label": "Efavirenz 600mg (EFAVIRENZ)"},
        {"val": "802^TENOFOVIR^99DCT", "label": "TENOFOVIR 300mg (TENOFOVIR)"},
        {"val": "1400^LAMIVUDINE AND TENOFOVIRR^99DCT", "label": "3TC 300 and TDF 300 (LAMIVUDINE AND TENOFOVIR)"},
        {"val": "1400^INDINAVIR^99DCT", "label": "INDINAVIR 400mg (INDINAVIR)"},
        {"val": "6467^NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE^99DCT", "label": "NVP and 3TC and AZT (NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE)"},
        {"val": "972^STAVUDINE LAMIVUDINE AND NEVIRAPINE^99DCT", "label": "NVP 200 and D4T 30 and 3TC 150 (STAVUDINE LAMIVUDINE AND NEVIRAPINE)"},
        {"val": "633^EFAVIRENZ^99DCT", "label": "EFAVIRENZ 600mg (EFAVIRENZ)"},
        {"val": "630^ZIDOVUDINE AND LAMIVUDINE^99DCT", "label": "3TC 150 and ZDV 300 (ZIDOVUDINE AND LAMIVUDINE)"},
        {"val": "6679^ABACAVIR AND LAMIVUDINE^99DCT", "label": "ABC 60 and 3TC 30 (ABACAVIR AND LAMIVUDINE)"},
        {"val": "630^COMBIVIR JR^99DCT", "label": "3TC 30 and ZDV 60 (COMBIVIR JR)"},
        {"val": "6156^RALTEGRAVIR^99DCT", "label": "RALTEGRAVIR 400mg (RALTEGRAVIR)"}];
    $('#arv_drug').autocomplete({
        source: arvDrugs,
        create: function (event, ui) {
            var drug_val = $('input[name="arv_drug"]').val();
            $.each(arvDrugs, function (i, elem) {
                if (elem.val == drug_val) {
                    $('#arv_drug').val(elem.label)
                }
            });
        },
        select: function (event, ui) {
            $('input[name="arv_drug"]').val(ui.item.val);
            $('#arv_drug').val(ui.item.label);
            return false;
        }
    });
    $('#arv_drug_1').autocomplete({
        source: arvDrugs,
        create: function (event, ui) {
            var drug_val = $('input[name="arv_drug_1"]').val();
            $.each(arvDrugs, function (i, elem) {
                if (elem.val == drug_val) {
                    $('#arv_drug_1').val(elem.label)
                }
            });
        },
        select: function (event, ui) {
            $('input[name="arv_drug_1"]').val(ui.item.val);
            $('#arv_drug_1').val(ui.item.label);
            return false;
        }
    });
    $('#arv_drug_2').autocomplete({
        source: arvDrugs,
        create: function (event, ui) {
            var drug_val = $('input[name="arv_drug_2"]').val();
            $.each(arvDrugs, function (i, elem) {
                if (elem.val == drug_val) {
                    $('#arv_drug_2').val(elem.label)
                }
            });
        },
        select: function (event, ui) {
            $('input[name="arv_drug_2"]').val(ui.item.val);
            $('#arv_drug_2').val(ui.item.label);
            return false;
        }
    });
    $('#arv_drug_3').autocomplete({
        source: arvDrugs,
        create: function (event, ui) {
            var drug_val = $('input[name="arv_drug_3"]').val();
            $.each(arvDrugs, function (i, elem) {
                if (elem.val == drug_val) {
                    $('#arv_drug_3').val(elem.label)
                }
            });
        },
        select: function (event, ui) {
            $('input[name="arv_drug_3"]').val(ui.item.val);
            $('#arv_drug_3').val(ui.item.label);
            return false;
        }
    });

    var outPatientCareLocation = [
        {"val": "2", "label": "Mosoriot Health Centre"},
        {"val": "3", "label": "Turbo Health Centre"},
        {"val": "12", "label": "Teso District Hospital"},
        {"val": "60", "label": "Chepsaita Dispensary"},
        {"val": "65", "label": "Angurai Health Centre"},
        {"val": "90", "label": "Changara Dispensary"},
        {"val": "91", "label": "Malaba Dispensary"},
        {"val": "106", "label": "Kamollo Dispensary"},
        {"val": "110", "label": "Mogoget Dispensary"},
        {"val": "111", "label": "Biribiriet Dispensary"},
        {"val": "112", "label": "Itigo Dispensary"},
        {"val": "113", "label": "Lelmokwo Dispensary"},
        {"val": "114", "label": "Kokwet Dispensary"},
        {"val": "115", "label": "Ngechek Dispensary"},
        {"val": "116", "label": "Cheramei Dispensary"},
        {"val": "117", "label": "Murgusi Dispensary"},
        {"val": "118", "label": "Cheplasgei Dispensary"},
        {"val": "119", "label": "Sigot Dispensary"},
        {"val": "120", "label": "Sugoi A Dispensary"},
        {"val": "121", "label": "Sugoi B Dispensary"},
        {"val": "122", "label": "Chepkemel Dispensary"},
        {"val": "124", "label": "Akichelesit Dispensary"},
        {"val": "125", "label": "Aboloi Dispensary"},
        {"val": "126", "label": "Moding Dispensary"},
        {"val": "127", "label": "Sambut Dispensary"},
        {"val": "128", "label": "Ngenyilel Dispensary"},
        {"val": "129", "label": "Sosiani Dispensary"},
        {"val": "20", "label": "Port Victoria Sub District"},
        {"val": "28", "label": "Ziwa Sub District"},
        {"val": "69", "label": "Huruma Health Center"},
        {"val": "131", "label": "Chebaiywa Health Centre"},
        {"val": "78", "label": "Mukhobola Sub County"},
        {"val": "4", "label": "Burnt Forest Sub District"},
        {"val": "133", "label": "Chepterit Dispensary "},
        {"val": "137", "label": "Osorongai Dispensary"},
        {"val": "136", "label": "Murgor Hills Dispensary"},
        {"val": "150", "label": "Sisenye Dispensary"},
        {"val": "105", "label": "Sirimba Dispensary"},
        {"val": "151", "label": "Rukala Dispensary "},
        {"val": "134", "label": "Kapyemit Dispensary"},
        {"val": "3", "label": "MTRH"},
        {"val": "3", "label": "UG District Hospital"},
        {"val": "152", "label": "Budalangi Dispensary"}];
    $('#out_patient_location').autocomplete({
        source: outPatientCareLocation,
        create: function (event, ui) {
            var location_val = $('input[name="out_patient_location"]').val();
            $.each(outPatientCareLocation, function (i, elem) {
                if (elem.val == location_val) {
                    $('#out_patient_location').val(elem.label)
                }
            });
        },
        select: function (event, ui) {
            $('input[name="out_patient_location"]').val(ui.item.val);
            $('#out_patient_location').val(ui.item.label);
            return false;
        }
    });

    var toggleDivById = function (elementId) {
        var divField = $("#"+elementId);
        if(elementId=='patient_type'){
//                ampathPatient
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.ampathPatient');
                    if (divToShowVal == '2') {
                        $divToShow.show();
                    } else {
                        $divToShow.hide();
                    }
                });
                $(object).trigger('change');
            });

        }  else if(elementId=='current_visit_type'){
//                current_visit_type
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    if (divToShowVal == '7850^INITIAL VISIT^99DCT') {
                        $('#initial_part').show();
                        $('#intro_part').show();
                        $('#follow_up_part').hide();
                        $('#third_part').hide();
                        $('#word_status_part').hide();
                    }else if (divToShowVal == '2345^FOLLOW-UP^99DCT') {
                        $('#follow_up_part').show();
                        $('#initial_part').hide();
                        $('#third_part').hide();
                        $('#intro_part').hide();
                        $('#word_status_part').hide();
                    }else if (divToShowVal == '2346^OFF THE SCHEDULE^99DCT') {
                        $('#follow_up_part').hide();
                        $('#initial_part').hide();
                        $('#third_part').show();
                        $('#intro_part').hide();
                        $('#word_status_part').hide();
                    }else if (divToShowVal == '9159^WARD STATUS VISIT^99DCT') {
                        $('#word_status_part').show();
                        $('#follow_up_part').hide();
                        $('#initial_part').hide();
                        $('#third_part').hide();
                        $('#intro_part').hide();
                    } else {
                        $('#initial_part').hide();
                        $('#follow_up_part').hide();
                        $('#third_part').hide();
                        $('#intro_part').hide();
                        $('#word_status_part').hide();
                        $('#word_status_part').hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='encounter_visit_type'){
//                current_visit_type
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    $("#current_visit_type").val("");
                    toggleDivById('current_visit_type');
                    if (divToShowVal == '5485^INPATIENT CARE OR HOSPITALIZATION^99DCT') {
                        $('#intro_part').show();
                    }else if (divToShowVal == '9096^OUT PATIENT^99DCT') {
                        $('#intro_part').hide();
                    } else {
                        $('#intro_part').hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='patient_status'){
//                current_visit_type
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    if (divToShowVal == '1067^UNKNOWN^99DCT') {
                        $('#tested_in_words').show();
                    } else {
                        $('#tested_in_words').hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='tested_in_word'){
//                current_visit_type
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    if (divToShowVal == '1065^YES^99DCT') {
                        $('#tested_in_words_yes').show();
                    } else {
                        $('#tested_in_words_yes').hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='confirmed_test'){
//                current_visit_type
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    if (divToShowVal == '703^POSITIVE^99DCT') {
                        $('#within_ampath_site').show();
                    } else {
                        $('#within_ampath_site').hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='within_ampath_area'){
//                current_visit_type
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    if (divToShowVal == '1066^NO^99DCT') {
                        $('#comprehensive_care_center').show();
                    } else {
                        $('#comprehensive_care_center').hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='defaulted'){
//                current_visit_type
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    if (divToShowVal == '1065^YES^99DCT') {
                        $('#basis_reason').show();
                    } else {
                        $('#basis_reason').hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='encounter\\.location_id_select'){
//                encounter.location_id_select
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    if (divToShowVal == 'Inpatient') {
                        $('#inpatient_encounter').show();
                    } else {
                        $('#encounter\\.location_id').val(divToShowVal);
                        $('#inpatient_encounter').hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='location_id_inpatient'){
//                encounter.location_id_select
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    if (divToShowVal != '') {
                        $('#encounter\\.location_id').val(divToShowVal);
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='side_effects'){
//                encounter.location_id_select
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    if (divToShowVal == '1065^YES^99DCT') {
                        $('#side_effects_details').show();
                    } else {
                        $('#side_effects_details').hide();
                    }
                });
                $(object).trigger('change');
            });

        }
        else{
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.encounter_provider');
                    if (divToShowVal == 'other') {
                        $('#encounter\\.provider_id').val('');
                        $divToShow.show();
                    } else {
                        if (divToShowVal != ''){
                            $('#encounter\\.provider_id').val($('#encounter\\.provider_id_select').val());
                        }
                        $divToShow.hide();
                    }
                });
                $(object).trigger('change');
            });

        }
    };
    toggleDivById('encounter\\.provider_id_select');
    toggleDivById('side_effects');
    toggleDivById('encounter\\.location_id_select');
    toggleDivById('location_id_inpatient');
    toggleDivById('patient_type');
    toggleDivById('current_visit_type');
    toggleDivById('encounter_visit_type');
    toggleDivById('patient_status');
    toggleDivById('tested_in_word');
    toggleDivById('confirmed_test');
    toggleDivById('within_ampath_area');
    toggleDivById('defaulted');

    var otherSelect = function (selectedElement) {
        var divField = $("select[name='reasons']");
        $.each(divField, function (index, object) {
            $(object).change(function () {
                var divToShowVal = $(this).val();
                var $divToShow = $(this).closest('.section').find('.otherSelectDiv');
                if (divToShowVal == 'OTHER_NOW'  ) {
                    $divToShow.show();
                } else {
                    $divToShow.hide();
                }
            });$(object).trigger('change');
        });
    }; otherSelect();

    var counties={
        "Bungoma":
        {
            "Bungoma":
                [
                    {"facility":"Bokoli Hosp","id":"15808"},
                    {"facility":"Miendo Dispensary","id":"16015"},
                    {"facility":"Mihuu Disp","id":"16016"},
                    {"facility":"Milo HC","id":"16018"},
                    {"facility":"Sinoko Dispensary (Bungoma East)","id":"16126"},
                    {"facility":"Webuye District Hospital","id":"16161"},
                    {"facility":"Webuye Health Centre","id":"16160"}
                ],
            "Mt. Elgon":
                [{"facility":"Chesinende Disp","id":"18582"},
                    {"facility":"Kaborom Dispensary","id":"15910"},
                    {"facility":"Kaboywo Dispensary","id":"15909"},
                    {"facility":"Kamenjo Dispensary","id":"15917"},
                    {"facility":"Sinoko Dispensary (Bungoma East)","id":"16126"},
                    {"facility":"Kaptalelio Dispensary","id":"15924"},
                    {"facility":"Kaptama (Friends) Disp","id":"15925"},
                    {"facility":"Mt. Elgon District Hospital","id":"16025"},
                    {"facility":"Sacha Health Centre","id":"16099"},]

        },

        "Busia":
        {
            "Busia":
                [
                    {"facility":"Budalangi Dispensary","id":"15811"},
                    {"facility":"Bumala A","id":"15823"},
                    {"facility":"Bumala B HC","id":"15824"},
                    {"facility":"Bumutiru Dispensary","id":"15826"},
                    {"facility":"Busia District Hospital","id":"15834"},
                    {"facility":"Busibwabo Dispensary","id":"15835"},
                    {"facility":"Butula Mission Health Centre","id":"15838"},
                    {"facility":"Bwaliro Dispensary","id":"15840"},
                    {"facility":"GK Prisons Busia","id":"15891"},
                    {"facility":"Ikonzo Dispensary","id":"17165"},
                    {"facility":"Khunyangu SDH","id":"15939"},
                    {"facility":"Matayos Health Centre","id":"16004"},
                    {"facility":"Mukhobola","id":"16029"},
                    {"facility":"Munongo Dispensary","id":"16043"},
                    {"facility":"Nasewa Health Centre","id":"16074"},
                    {"facility":"Osieko","id":"17680"},
                    {"facility":"Port Victoria","id":"16091"},
                    {"facility":"Rukala Dispensary","id":"16095"},
                    {"facility":"Tanaka Nursing Home","id":"16149"}
                ],
            "Teso":
                [
                    {"facility":"Angurai","id":"15800"},
                    {"facility":"Changara (GOK) Disp","id":"16421"},
                    {"facility":"Kamolo Dispensary","id":"17242"},
                    {"facility":"Malaba Disp","id":"15993"},
                    {"facility":"Moding Health Centre","id":"16021"},
                    {"facility":"Teso District Hospital","id":"16150"}
                ]
        },

        "Elgeyo":
        {
            "Keiyo":
                [
                    {"facility":"Chegilet Dispensary","id":"14306"},
                    {"facility":"Chepkorio Health Centre","id":"14346"},
                    {"facility":"Flourspar Health Centre","id":"14500"},
                    {"facility":"Iten","id":"14586"},
                    {"facility":"Kamwosor SDH","id":"14680"},
                    {"facility":"Kaptarakwa Sub-District Hospital","id":"14776"},
                    {"facility":"Kapteren HC","id":"14781"},
                    {"facility":"Kocholwo Sub-District Hospital","id":"15238"},
                    {"facility":"Msekekwa Health Centre","id":"15238"},
                    {"facility":"Muskut Health Centre","id":"15260"},
                    {"facility":"Sergoit Dispensary","id":"15554"},
                    {"facility":"Simotwo","id":"15578"},
                    {"facility":"Tambach SDH","id":"15703"}

                ],
            "Marakwet":
                [
                    {"facility":"Arror Health Centre","id":"14216"},
                    {"facility":"Chebiemit District Hospital","id":"14294"},
                    {"facility":"Chebororwa Health Centre","id":"14301"},
                    {"facility":"Chemworor Dipsensary","id":"14327"},
                    {"facility":"Cheptongei Dispensary","id":"14373"},
                    {"facility":"Chesongoch SDH","id":"14373"},
                    {"facility":"Kamogo  Health Centre","id":"14674"},
                    {"facility":"Kaparon  Health Centre","id":"16335"},
                    {"facility":"Kapcherop Health Centre","id":"14695"},
                    {"facility":"Kapsowar (AIC) Hospital","id":"14767"},
                    {"facility":"Kaptalamwa Health Centre","id":"14774"},
                    {"facility":"Kapyego Health Center","id":"14798"},
                    {"facility":"Mogil Health Centre","id":"15193"},
                    {"facility":"Tot Sub-District Hospital","id":"15738"}
                ]
        },


        "Kisumu":
        {
            "Kisumu":
                [
                    {"facility":"Chulaimbo SDH","id":"13528"},
                    {"facility":"Riat dispensary","id":"14046"},
                    {"facility":"Siriba Dispensary","id":"14094"},
                    {"facility":"Sunga Dispensary","id":"17175"}

                ]

        },

        "Nandi":
        {
            "Nandi North":
                [
                    {"facility":"Diguna Disp","id":"15229"},
                    {"facility":"Mosoriot","id":"15229"},


                ]
        },

        "Trans N":
        {
            "Trans Nzoia":
                [
                    {"facility":"Andersen Medical Centre","id":"14203"},
                    {"facility":"Bikeke Health Centre","id":"16361"},
                    {"facility":"Chepchoina Dispensary","id":"14332"},
                    {"facility":"Cherangany Health Centre (Trans Nzoia East)","id":"14379"},
                    {"facility":"Endebess District Hospital","id":"14455"},
                    {"facility":"GK Farm Prisons Kitale (Trans Nzoia)","id":"14514"},
                    {"facility":"GK Remand Prisons Dispensary (Trans Nzoia West)","id":"14528"},
                    {"facility":"Kapkoi Dispensary (Kwanza)","id":"14720"},
                    {"facility":"Kaplamai Health Centre","id":"14734"},
                    {"facility":"Kapsara District Hospital","id":"14753"},
                    {"facility":"Kiminini Cottage Hospital","id":"14872"},
                    {"facility":"Kitalale Dispensary","id":"14946"},
                    {"facility":"Kitale District Hospital","id":"14947"},
                    {"facility":"Kolongolo M Dispensary","id":"14981"},
                    {"facility":"Kwanza Health Centre","id":"15003"},
                    {"facility":"Motosiet Dispensary","id":"15234"},
                    {"facility":"Mt Elgon National Park Dispensary","id":"15240"},
                    {"facility":"Mt. Elgon Hospital (Trans Nzoia West)","id":"15239"},
                    {"facility":"Muungano Dispensary","id":"15239"},
                    {"facility":"Saboti","id":"15508"},
                    {"facility":"St Raphael Dispensary","id":"18515"},
                    {"facility":"Suwerwa Health Centre","id":"15692"},
                    {"facility":"Tulwet HC","id":"15747"}

                ]

        },

        "Uasin G":
        {
            "Uasin Gishu":
                [
                    {"facility":"Amani Hospital","id":"16347"},
                    {"facility":"Burnt Forest","id":"16347"},
                    {"facility":"Cedar Associate Clinic","id":"14280"},
                    {"facility":"Chepkanga Health Centre","id":"14335"},
                    {"facility":"Chepsaita","id":"14358"},
                    {"facility":"Cheramei Dispensary","id":"14377"},
                    {"facility":"Elgeyo Border","id":"14437"},
                    {"facility":"FHOK","id":"16348"},
                    {"facility":"GK Ngeria Prison","id":"14524"},
                    {"facility":"GK Prison Eldoret","id":"14519"},
                    {"facility":"Huruma SDH","id":"'14555"},
                    {"facility":"Kaptumo Dispensary","id":"14791"},
                    {"facility":"Kesses","id":"14841"},
                    {"facility":"Kipkabus","id":"14893"},
                    {"facility":"Moi Teaching and Referral Hospital","id":"15204"},
                    {"facility":"Moi University HC","id":"15205"},
                    {"facility":"Moiben","id":"15206"},
                    {"facility":"Mois Bridge HC","id":"15209"},
                    {"facility":"Pioneer HC","id":"15463"},
                    {"facility":"Plateau","id":"15464"},
                    {"facility":"Railways","id":"15478"},
                    {"facility":"Soy HC","id":"15623"},
                    {"facility":"St Ladislaus Dispensary","id":"15655"},
                    {"facility":"St Lukes Orthopaedic and Trauma Hospital","id":"15655"},
                    {"facility":"St. Mary's Kapsoya","id":"15655"},
                    {"facility":"Turbo","id":"15753"},
                    {"facility":"Uasin Gishu District Hospital","id":"15758"},
                    {"facility":"Ziwa SDH","id":"15788"}

                ]
        },

        "West Po":
        {
            "West Pokot":
                [
                    {"facility":"Alale Health Centre","id":"16367"},
                    {"facility":"Amakuriat Dispensary","id":"14198"},
                    {"facility":"Chepareria Sub District Hospital","id":"14330"},
                    {"facility":"Kabichbich Health Centre","id":"14615"},
                    {"facility":"Kacheliba District Hospital","id":"14634"},
                    {"facility":"Kapenguria District Hospital","id":"14701"},
                    {"facility":"Kaptabuk Dispensary (West Pokot)","id":"14772"},
                    {"facility":"Kasei Dispensary","id":"14807"},
                    {"facility":"Konyao Dispensary","id":"14988"},
                    {"facility":"Lomut Dispensary","id":"15073"},
                    {"facility":"Marich Dispensary","id":"15130"},
                    {"facility":"Orolwo Dispensary","id":"16370"},
                    {"facility":"Ortum Hospital","id":"15446"},
                    {"facility":"Shujaa Satellite Clinic","id":"15446"},
                    {"facility":"Sigor Sub District Hospital","id":"'15564"},
                    {"facility":"Sina Dispensary","id":"15580"},
                    {"facility":"Tinei Disp","id":"16368"},
                    {"facility":"kanyarkwat dispensary","id":"14689"},
                    {"facility":"keringet health center","id":"14837"}

                ]
        }

    };
    var key1,key2,key3;
    var hold_locations = [];
    var hold_divisions =[];
    var selectedDistrict,selectedDivision;
    for (key1 in counties) {
        $("#county_to_refer").append("<option value='"+key1+"'>"+key1+"</option>");
        $("#county_to_refer_ampath_catchment").append("<option value='"+key1+"'>"+key1+"</option>");
        $("#county_to_refer_second_visit_quiz").append("<option value='"+key1+"'>"+key1+"</option>");
        $("#county_to_refer_tested_wards").append("<option value='"+key1+"'>"+key1+"</option>");
    }
    $("#county_to_refer").change(function () {
        selectedDistrict = this.value;
        $("#sub_county").empty();
        $("#sub_county").append("<option value='...'>...</option>");
        $("#county_facility").empty();
        $("#county_facility").append("<option value='...'>...</option>");
        for (key2 in counties[selectedDistrict]) {
            if(!hold_divisions.indexOf(key2)> -1){
                hold_divisions.push(key2);
                $("#sub_county").append("<option value='"+key2+"'>"+key2+"</option>");
            }
        }

    });
    $("#sub_county").change(function () {
        selectedDivision = this.value;
        $("#county_facility").empty();
        $("#county_facility").append("<option value='...'>...</option>");
        for (key3 in counties[selectedDistrict][selectedDivision]) {
            if(!hold_locations.indexOf(key3)> -1){
                hold_locations.push(key3);
                $("#county_facility").append("<option value='"+counties[selectedDistrict][selectedDivision][key3].id+"'>"+counties[selectedDistrict][selectedDivision][key3].facility+"</option>");

            }
        }

    });

    $("#county_to_refer_ampath_catchment").change(function () {
        selectedDistrict = this.value;
        $("#sub_county_ampath_catchment").empty();
        $("#sub_county_ampath_catchment").append("<option value='...'>...</option>");
        $("#county_facility_ampath_catchment").empty();
        $("#county_facility_ampath_catchment").append("<option value='...'>...</option>");
        for (key2 in counties[selectedDistrict]) {
            if(!hold_divisions.indexOf(key2)> -1){
                hold_divisions.push(key2);
                $("#sub_county_ampath_catchment").append("<option value='"+key2+"'>"+key2+"</option>");
            }
        }

    });
    $("#sub_county_ampath_catchment").change(function () {
        selectedDivision = this.value;
        $("#county_facility_ampath_catchment").empty();
        $("#county_facility_ampath_catchment").append("<option value='...'>...</option>");
        for (key3 in counties[selectedDistrict][selectedDivision]) {
            if(!hold_locations.indexOf(key3)> -1){
                hold_locations.push(key3);
                $("#county_facility_ampath_catchment").append("<option value='"+counties[selectedDistrict][selectedDivision][key3].id+"'>"+counties[selectedDistrict][selectedDivision][key3].facility+"</option>");

            }
        }

    });
    $("#county_to_refer_second_visit_quiz").change(function () {
        selectedDistrict = this.value;
        $("#sub_county_second_visit_quiz").empty();
        $("#sub_county_second_visit_quiz").append("<option value='...'>...</option>");
        $("#county_facility_second_visit_quiz").empty();
        $("#county_facility_second_visit_quiz").append("<option value='...'>...</option>");
        for (key2 in counties[selectedDistrict]) {
            if(!hold_divisions.indexOf(key2)> -1){
                hold_divisions.push(key2);
                $("#sub_county_second_visit_quiz").append("<option value='"+key2+"'>"+key2+"</option>");
            }
        }

    });
    $("#sub_county_second_visit_quiz").change(function () {
        selectedDivision = this.value;
        $("#county_facility_second_visit_quiz").empty();
        $("#county_facility_second_visit_quiz").append("<option value='...'>...</option>");
        for (key3 in counties[selectedDistrict][selectedDivision]) {
            if(!hold_locations.indexOf(key3)> -1){
                hold_locations.push(key3);
                $("#county_facility_second_visit_quiz").append("<option value='"+counties[selectedDistrict][selectedDivision][key3].id+"'>"+counties[selectedDistrict][selectedDivision][key3].facility+"</option>");

            }
        }

    });
    $("#county_to_refer_tested_wards").change(function () {
        selectedDistrict = this.value;
        $("#sub_county_tested_wards").empty();
        $("#sub_county_tested_wards").append("<option value='...'>...</option>");
        $("#county_facility_tested_wards").empty();
        $("#county_facility_tested_wards").append("<option value='...'>...</option>");
        for (key2 in counties[selectedDistrict]) {
            if(!hold_divisions.indexOf(key2)> -1){
                hold_divisions.push(key2);
                $("#sub_county_tested_wards").append("<option value='"+key2+"'>"+key2+"</option>");
            }
        }

    });
    $("#sub_county_tested_wards").change(function () {
        selectedDivision = this.value;
        $("#county_facility_tested_wards").empty();
        $("#county_facility_tested_wards").append("<option value='...'>...</option>");
        for (key3 in counties[selectedDistrict][selectedDivision]) {
            if(!hold_locations.indexOf(key3)> -1){
                hold_locations.push(key3);
                $("#county_facility_tested_wards").append("<option value='"+counties[selectedDistrict][selectedDivision][key3].id+"'>"+counties[selectedDistrict][selectedDivision][key3].facility+"</option>");

            }
        }

    });

//        word status logic start
    var toggleCheckBox = function () {
        var objectArray = {
            "#on_ios_treatment": "#ios_treatment",
            "#ios_treatment_other": "#other_ios",
            "#sideEffect_other": "#other_sideEffect",
            "#service_refill": "#ois_refilled",
            "#service_refill_OIS": "#other_ios_medication",
            "#service_change_regime": "#change_regime",
            "#arvSelect": "#arvSelectToShow",
            "#tb_treatment": "#tb_drugs",
            "#tb_rhze": "#rhze_fre_div",
            "#tb_rhe": "#rhe_fre_div",
            "#tb_rhz": "#rhz_fre_div",
            "#tb_rh": "#rh_fre_div",
            "#tb_strep": "#step_fre_div",
            "#tb_etha": "#ehta_fre_div",
            "#tb_butin": "#rif_fre_div",
            "#tb_zima": "#pyra_fre_div",
            "#tb_eh": "#eh_fre_div",
            "#tb_ref": "#pcin_fre_div",
            "#tb_inh": "#inh_fre_div",
            "#defaulted_basis_other": "#other_basis",
            "#defaulted_basis_medication": "#meds_missed"

        };
        $.each(objectArray, function (k, v) {
            $(k).change(function () {
                if ($(k).is(':checked')) {
                    $(v).show();
                } else {
                    $(v).hide();
                }
            });
            $(k).trigger('change');
        })
    };toggleCheckBox();

    var toggleById = function (elementId) {
        var divField = $("#"+elementId);
        if(elementId=='first_visit'){
//                first_visit
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.first_visit_quiz');
                    var $divToShow2 = $(this).closest('.section').find('.second_visit_quiz');
                    if (divToShowVal == '1065^YES^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '1066^NO^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }  else if(elementId=='patient_hiv_status_visit_one'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.has_the_patient_been_tested');
                    var $divToShow2 = $(this).closest('.section').find('.known_patient');
                    if (divToShowVal == '1067^UNKNOWN^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '703^POSITIVE^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        } else if(elementId=='patient_been_tested'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.patient_been_tested_quiz');
                    var $divToShow2 = $(this).closest('.section').find('.patient_been_tested_quiz_no');
                    if (divToShowVal == '1065^YES^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '1066^NO^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='confirmed_test_in_wards'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.confirmed_test_in_wards_quiz');
                    if (divToShowVal == '703^POSITIVE^99DCT') {
                        $divToShow.show();
                    } else {
                        $divToShow.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='tetsed_while_in_ward'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.tetsed_while_in_ward_quiz');
                    if (divToShowVal == '703^POSITIVE^99DCT') {
                        $divToShow.show();
                    } else {
                        $divToShow.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='within_ampath_catchment'){
//                within_ampath_catchment
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.within_ampath_catchment_quiz');
                    var $divToShow2 = $(this).closest('.section').find('.not_within_ampath_catchment_quiz');
                    if (divToShowVal == '6834^OUT OF AMPATH CATCHMENT AREA^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    }else if (divToShowVal == '6833^IN AMPATH CATCHMENT AREA^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='knwn_ampath_patient'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.knwn_and_within_ampath_catchment');
                    var $divToShow2 = $(this).closest('.section').find('.not_within_ampath_catchment');
                    if (divToShowVal == '1065^YES^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '1066^NO^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='patient_been_discharged'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.patient_been_discharged_quiz');
                    var $divToShow2 = $(this).closest('.section').find('.patient_been_discharged_no_quiz');
                    if (divToShowVal == '1065^YES^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '1066^NO^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='tested_at_the_ward'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.tested_at_the_ward_quiz');
                    if (divToShowVal == '1065^YES^99DCT') {
                        $divToShow.show();
                    } else {
                        $divToShow.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='ampath_location_select'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.ampath_location_select_quiz');
                    var $divToShow2 = $(this).closest('.section').find('.not_ampath_location_select_quiz');
                    if (divToShowVal == '1286^AMPATH^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '1287^NON-AMPATH^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='knwn_ampath_patient_initial'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.knwn_ampath_patient_initial_quiz');
                    if (divToShowVal == '1') {
                        $divToShow.show();
                    } else {
                        $divToShow.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='patient_been_tested_check'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.patient_been_tested_check_quiz');
                    var $divToShow2 = $(this).closest('.section').find('.tested_at_the_ward_check_quiz');
                    if (divToShowVal == '1066^NO^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '1065^YES^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='tested_wards_catchment_area'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.tested_wards_catchment_area_quiz_yes');
                    var $divToShow2 =
                        $(this).closest('.section').find('.tested_wards_catchment_area_quiz_no');
                    if (divToShowVal == '6833^IN AMPATH CATCHMENT AREA^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '6834^OUT OF AMPATH CATCHMENT AREA^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='refering_patient'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.refering_patient_quiz');
                    var $divToShow2 =
                        $(this).closest('.section').find('.not_refering_patient_quiz');
                    if (divToShowVal == '1286^AMPATH^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '1287^NON-AMPATH^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }else if(elementId=='refering_patient_second_visit'){
//                patient_hiv_status_visit_one
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.refering_patient_second_visit_quiz');
                    var $divToShow2 =
                        $(this).closest('.section').find('.not_refering_patient_second_visit_quiz');
                    if (divToShowVal == '1286^AMPATH^99DCT') {
                        $divToShow.show();
                        $divToShow2.hide();
                    }else if (divToShowVal == '1287^NON-AMPATH^99DCT') {
                        $divToShow2.show();
                        $divToShow.hide();
                    } else {
                        $divToShow.hide();
                        $divToShow2.hide();
                    }
                });
                $(object).trigger('change');
            });

        }
    };
    toggleById('first_visit');
    toggleById('patient_hiv_status_visit_one');
    toggleById('patient_been_tested');
    toggleById('confirmed_test_in_wards');
    toggleById('within_ampath_catchment');
    toggleById('knwn_ampath_patient');
    toggleById('patient_been_discharged');
    toggleById('tested_at_the_ward');
    toggleById('patient_been_tested_check');
    toggleById('tetsed_while_in_ward');
    toggleById('tested_wards_catchment_area');
    toggleById('knwn_ampath_patient_initial');
    toggleById('ampath_location_select');
    toggleById('refering_patient');
    toggleById('refering_patient_second_visit');

    $('#ampath_out_patient_location').autocomplete({
        source: outPatientCareLocation,
        create: function (event, ui) {
            var location_val = $('input[name="ampath_out_patient_location"]').val();
            $.each(outPatientCareLocation, function (i, elem) {
                if (elem.val == location_val) {
                    $('#ampath_out_patient_location').val(elem.label)
                }
            });
        },
        select: function (event, ui) {
            $('input[name="ampath_out_patient_location"]').val(ui.item.val);
            $('#ampath_out_patient_location').val(ui.item.label);
            return false;
        }
    });
    $('#referred_ampath_facility').autocomplete({
        source: outPatientCareLocation,
        create: function (event, ui) {
            var location_val = $('input[name="referred_ampath_facility"]').val();
            $.each(outPatientCareLocation, function (i, elem) {
                if (elem.val == location_val) {
                    $('#referred_ampath_facility').val(elem.label)
                }
            });
        },
        select: function (event, ui) {
            $('input[name="referred_ampath_facility"]').val(ui.item.val);
            $('#referred_ampath_facility').val(ui.item.label);
            return false;
        }
    });
    $('#kwn_patient_care_location').autocomplete({
        source: outPatientCareLocation,
        create: function (event, ui) {
            var location_val = $('input[name="kwn_patient_care_location"]').val();
            $.each(outPatientCareLocation, function (i, elem) {
                if (elem.val == location_val) {
                    $('#kwn_patient_care_location').val(elem.label)
                }
            });
        },
        select: function (event, ui) {
            $('input[name="kwn_patient_care_location"]').val(ui.item.val);
            $('#kwn_patient_care_location').val(ui.item.label);
            return false;
        }
    });
    $('#ampath_out_patient_location_check').autocomplete({
        source: outPatientCareLocation,
        create: function (event, ui) {
            var location_val = $('input[name="ampath_out_patient_location_check"]').val();
            $.each(outPatientCareLocation, function (i, elem) {
                if (elem.val == location_val) {
                    $('#ampath_out_patient_location_check').val(elem.label)
                }
            });
        },
        select: function (event, ui) {
            $('input[name="ampath_out_patient_location_check"]').val(ui.item.val);
            $('#ampath_out_patient_location_check').val(ui.item.label);
            return false;
        }
    });

    $.returnDate = function(days) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        return day + "-" + month + "-" + year;
    };
    $('#return_date_initial').val($.returnDate(parseInt(14)));
    $('#return_date_followUP').val($.returnDate(parseInt(30)));

    var $noSelect = $('.noSelect');
    $noSelect.change(function () {
        var divToShowVal = $(this).val();
        if (divToShowVal == '1066^NO^99DCT') {
            if(($(this).is(':checked'))){
                $('#noSectionToShow').show();
            }
            else{
                $('#noSectionToShow').hide();
            }
        }else{
            $('#noSectionToShow').hide();
        }
    });$noSelect.trigger('change');

    $('#patient\\.phone_number').val($.fn.currentPhoneNumber());
    if($('#patient\\.phone_number').val() == ''){
        $('#current_phone_number').hide();
        $('#noPhoneNumber').removeClass('hidden');
    }


    var generateTableForIds = function(type,value) {
        var dynamicContent =
            '<tr>' +
            '<td>'+type+'</td>' +
            '<td>'+value+'</td>';
        $("#current_ids").append(dynamicContent);
    };

    var generateHistoricalSideEffects = function(value) {
        var dynamicContent =
            '<tr><td>'+value+'</td></tr>';
        $("#historical_side_effects").append(dynamicContent);
    };

    var assignPatientIds  = function () {
        var patientIdTypes = $.fn.patientIDTypes();
        var patientIdValues = $.fn.patientIDValues();
        $.each(patientIdTypes, function(index, value) {
            generateTableForIds(value,patientIdValues[index]);
        });
    };assignPatientIds();

    var historicalSideEffects  = function () {
        var historicalSideEffects = $.fn.historicalSideEffects();
        $.each(historicalSideEffects, function(index, value) {
            generateHistoricalSideEffects(value);
        });
    };historicalSideEffects();

});
