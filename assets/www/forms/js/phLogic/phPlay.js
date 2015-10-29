$(document).ready(function () {
        function getAge(birthDate) {
            var now = new Date();

            function isLeap(year) {
                return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
            }

            // days since the birthdate
            var days = Math.floor((now.getTime() - birthDate.getTime())/1000/60/60/24);
            var age = 0;
            // iterate the years
            for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++){
                var daysInYear = isLeap(y) ? 366 : 365;
                if (days >= daysInYear){
                    days -= daysInYear;
                    age++;
                    // increment the age only if there are available enough days for the year.
                }
            }
            return age;
        }

        var age = ""+$.fn.getAgeInYears($('#patient\\.birth_date').val());
        var yearsMonths = age.split('.');
        $('#age').val(yearsMonths[0] +" Years");
        var dateFormat = "dd-mm-yy";
        var currentDate = $.datepicker.formatDate(dateFormat, new Date());
        var encounterDatetime = $('#encounter\\.encounter_datetime');
        $('#drug_plan_start_date').val(currentDate);
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
        var toggleProvider = function () {
            var divField = $("select[id='encounter.provider_id_select']");
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

        };toggleProvider();
        var toggleComplains = function () {
            var divField = $("select[id='report_any_complaints']");
            $.each(divField, function (index, object) {
                $(object).change(function () {
                    var divToShowVal = $(this).val();
                    var $divToShow = $(this).closest('.section').find('.show_complains');
                    if (divToShowVal == '1065^YES^99DCT') {
                        $divToShow.show();
                    } else {
                        $divToShow.hide();
                    }
                });
                $(object).trigger('change');
            });

        };toggleComplains();

        $('#bigpig_return_form').validate({
            rules: {
                pulse: {
                    number: true,
                    range: [0, 230]
                },
                temperature_c: {
                    number: true,
                    range: [25, 43]
                },
                weight_kg: {
                    number: true,
                    range: [1, 250]
                },
                height_cm: {
                    number: true,
                    range: [10, 228]
                },
                glycosylated_hemoglobin: {
                    number: true,
                    range: [0, 20]
                },
                na_mmol_L: {
                    number: true,
                    range: [0, 2000]
                },
                k_mmol_L: {
                    number: true,
                    range: [0, 50]
                },
                cl_mmol_L: {
                    number: true,
                    range: [0, 600]
                },
                urea_mmol_L_2_6: {
                    number: true,
                    range: [0, 330]
                },
                urea_mmol_L_21: {
                    number: true,
                    range: [0, 330]
                },
                creat_mmol_L_45: {
                    number: true,
                    range: [0, 11050]
                },
                creat_mmol_L_08: {
                    number: true,
                    range: [0, 11050]
                },
                hgb: {
                    number: true,
                    range: [0, 50]
                },
                mcv: {
                    number: true,
                    range: [0, 500]
                },
                wbc: {
                    number: true,
                    range: [0, 500]
                },
                tc_200: {
                    number: true,
                    range: [0, 200]
                },
                tc_5: {
                    number: true,
                    range: [0, 100]
                },
                ldl_3: {
                    number: true,
                    range: [0, 75]
                },
                ldl_130: {
                    number: true,
                    range: [3.34, 129]
                },
                tgs_18: {
                    number: true,
                    range: [0, 1.79]
                },
                tgs_160: {
                    number: true,
                    range: [1.8, 159]
                },
                hdl_103: {
                    number: true,
                    range: [1.03, 44]
                },
                hdl_45: {
                    number: true,
                    range: [45,1000]
                },
                systolicBloodPressure: {
                    number: true,
                    range: [50, 300]
                },
                diastolicBloodPressure: {
                    number: true,
                    range: [20, 150]
                },
                glucose: {
                    number: true,
                    range: [0, 150]
                }
            }
        });
        $('#patient\\.phone_number').val($.fn.currentPhoneNumber());
        if($('#patient\\.phone_number').val() == ''){
            $('#current_phone_number').hide();
            $('#noPhoneNumber').removeClass('hidden');
        }
        //Toggle Display when YES/inpatient/No is selected
        var $yesSelect = $('.yesSelect');
        $yesSelect.change(function () {
            var $yesSectionToShow = $(this).closest('.section').find('.yesSectionToShow');
            var divToShowVal = $(this).val();
            if (divToShowVal == '1065^YES^99DCT') {
                if(($(this).is(':checked'))){
                    $yesSectionToShow.show();
                }
                else{
                    $yesSectionToShow.hide();
                }
            }else{
                $yesSectionToShow.hide();
            }
        });$yesSelect.trigger('change');

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

        /* Start - Compute the BMI if the weight & height are provided */
        var $weight = $('#weight_kg');
        var $height = $('#height_cm');
        var $bodyMassIndex = $('.bodyMassIndex');
        var displayBMI = function () {
            var $bmiReminder = $('#bmiReminder');
            if (($weight.val() != '') && ($height.val() != '')) {
                $bodyMassIndex.find('input').val(computeBMI());
                $bodyMassIndex.show();
                if(computeBMI()>25){
                    $bmiReminder.show();
                }
                else{
                    $bmiReminder.hide();
                }
            } else {
                $bodyMassIndex.hide();
                $bmiReminder.hide();
            }
        };
        var computeBMI = function () {
            var weight = parseInt($weight.val());
            var height = parseInt($height.val()) / 100;
            return (weight / (height * height)).toFixed(2);
        };

        $weight.change(displayBMI);
        $weight.trigger('change');

        $height.change(displayBMI);
        $height.trigger('change');

//        end BMI

        /* Start - Define variables for conditional displays */
        var $systolicBloodPressure = $('#systolic_blood_pressure');
        var $diastolicBloodPressure = $('#diastolic_blood_pressure');
        var $currentVisitType = $('#current_visit_type');
        var $urinePregnancyTest = $('#urine_pregnancy_test_qualitative');
        var getCurrentMedicationValues = function () {
            return $('input[name="tmp_drugs"]:checked').map(function () {
                return this.value;
            }).get();
        };
        var getPrescribedMedicationValues= function () {
            return $('input[name="drugs_dispensed"]:checked').map(function () {
                return this.value;
            }).get();
        };
        var getReviewOfSystemsGeneralValues = function () {
            return $('input[data-concept="1069^REVIEW OF COMPLAINS, GENERAL^99DCT"]:checked').map(function () {
                return this.value;
            }).get();
        };
        var checkReviewOfSystemsGeneralForDisplay = function () {
            var reviewOfSystemsGeneral = getReviewOfSystemsGeneralValues();
            return reviewOfSystemsGeneral.indexOf("590^EDEMA, LEGS^99DCT") < 0 && reviewOfSystemsGeneral.indexOf("5963^SHORTNESS OF BREATH WITH EXERTION^99DCT") < 0 &&
                    reviewOfSystemsGeneral.indexOf("6021^OLIGURIA^99DCT") < 0 && reviewOfSystemsGeneral.indexOf("6005^FOCAL WEAKNESS^99DCT") < 0;
        };

        var hTNReminderColumnC = function () {
            var $htnColumnC = $('#htnColumnC');
            var selectedVisitType = $currentVisitType.val();
            var systolicBloodValue = parseFloat($systolicBloodPressure.val());
            var diastolicBloodValue = parseFloat($diastolicBloodPressure.val());
            if ((selectedVisitType =='7034^FIRST DISPENSARY VISIT AFTER HCT^99DCT' || selectedVisitType == '7875^WALK IN^99DCT')
                    &&(systolicBloodValue >= 140 || diastolicBloodValue >= 90)
                    && !isAtLeast35YearsOld()) {
                $htnColumnC.show();
            } else {
                $htnColumnC.hide();
            }
        } ;
        hTNReminderColumnC();


        // value that must be selected alone.
        var referralValues = ['none'];
        var referralValueConcept = ['1107^NONE^99DCT'];
        // message to be shown when the above option is selected with other options.
        var referralMessage = "If None is selected, it should be the only option.";
        $(':checkbox[name="drugs_dispensed"]').change(function () {
            toggleValidationMessages(validateAlone($(this), referralValues, referralMessage));
        });
        $(':checkbox[name="tmp_drugs"]').change(function () {
            toggleValidationMessages(validateAlone($(this), referralValues, referralMessage));
        });
        $(':checkbox[data-concept="1069^REVIEW OF COMPLAINS, GENERAL^99DCT"]').change(function () {
            toggleValidationMessages(validateAlone($(this), referralValueConcept, referralMessage));
        });
        $(':checkbox[data-concept="6327^PATIENT EDUCATION RECEIVED THIS VISIT^99DCT"]').change(function () {
            toggleValidationMessages(validateAlone($(this), referralValueConcept, referralMessage));
        });
        $(':checkbox[data-concept="1272^REFERRALS ORDERED^99DCT"]').change(function () {
            toggleValidationMessages(validateAlone($(this), referralValueConcept, referralMessage));
        });



         var stdReminderColumnC = function () {
                    var $stdColumnC = $('#stdColumnC');
                    var reviewOfSystemsGeneral = getReviewOfSystemsGeneralValues();
                    if (reviewOfSystemsGeneral.indexOf("5953^VISION DIFFICULTIES^99DCT") >= 0
                            || reviewOfSystemsGeneral.indexOf("5963^SHORTNESS OF BREATH WITH EXERTION^99DCT") >= 0
                            || reviewOfSystemsGeneral.indexOf("7044^HEART RACING^99DCT") >= 0
                            || reviewOfSystemsGeneral.indexOf("590^EDEMA, LEGS^99DCT") >= 0
                            || reviewOfSystemsGeneral.indexOf("6006^CONFUSION^99DCT") >= 0
                            || reviewOfSystemsGeneral.indexOf("6005^FOCAL WEAKNESS^99DCT") >= 0
                            || reviewOfSystemsGeneral.indexOf("2295^UNCONSCIOUS^99DCT") >= 0
                            || reviewOfSystemsGeneral.indexOf("877^DIZZINESS^99DCT") >= 0
                            || reviewOfSystemsGeneral.indexOf("206^CONVULSIONS^99DCT") >= 0
                    ) {
                        $stdColumnC.show();
                    } else {
                        $stdColumnC.hide();
                    }
         };stdReminderColumnC();

         $('input[data-concept="1069^REVIEW OF COMPLAINS, GENERAL^99DCT"]').change(function () {

                     stdReminderColumnC();

         });


        function deselect(e) {
            $('.pop').slideFadeToggle(function() {
                e.removeClass('selected');
            });
        }

        $(function() {
            $('#contact').on('click', function() {
                if($(this).hasClass('selected')) {
                    deselect($(this));
                } else {
                    $(this).addClass('selected');
                    $('.pop').slideFadeToggle();
                }
                return false;
            });

            $('.close').on('click', function() {
                deselect($('#contact'));
                return false;
            });
        });

        jQuery.fn.existsWithValue = function() {
            return this.length && this.val().length;
        };
        var generateTableForPosted = function(drug,dose,frequency,start_date,target_table) {
            var dynamicContent =
                    '<tr>' +
                    '<td>'+drug[0] +drug.toLowerCase().slice(1)+'</td>' +
                    '<td>'+dose+'</td>' +
                    '<td>'+trimFrequency(frequency)+'</td>' +
                    '<td>'+start_date+'</td> ' ;
            $("#"+target_table).append(dynamicContent);
        };
        var generateTableForPostedStopped = function(drug,dose,frequency,start_date,stop_date,target_table) {
            var dynamicContent =
                    '<tr>' +
                    '<td>'+trimDrug(drug)+'</td>' +
                    '<td>'+dose+'</td>' +
                    '<td>'+trimFrequency(frequency)+'</td>' +
                    '<td>'+start_date+'</td> ' +
                    '<td>'+stop_date+'</td>';
            $("#"+target_table).append(dynamicContent);
        };

        var trimFrequency = function (frequency) {

            if((frequency.indexOf("ONCE A DAY") > -1)||(frequency.indexOf("EVENING") > -1)|| (frequency.indexOf("MORNING") > -1)) {
                return "OD";
            }else if(frequency.indexOf("TWICE A DAY") > -1){
                return "BD";
            }else if(frequency.indexOf("THREE TIMES A DAY") > -1){
                return "TDS";
            }else if(frequency.indexOf("FOUR TIMES A DAY") > -1){
                return "QID";
            }else if(frequency.indexOf("AS NEEDED") > -1){
                return "PRN";
            } else{
                return frequency
            }
        };
        var trimDrug = function (drug) {

            if(drug=='HYDROCHLOROTHIAZIDE'){
                return "HCTZ";
            }else if(drug=='RIFAMPICIN ISONIAZID PYRAZINAMIDE AND ETHAMBUTOL'){
                return "RHZE";
            }else if(drug=='RIFAMPICIN ISONIAZID AND PYRAZINAMIDE'){
                return "Rifater";
            }else if(drug=='RIFAMPICIN AND ISONIAZID'){
                return "RH";
            }else if(drug=='NEVIRAPINE'){
                return "NVP";
            }else if(drug=='EFAVIRENZ'){
                return "EFV";
            }else if(drug=='STAVUDINE'){
                return "D4t";
            }else if(drug=='ZIDOVUDINE'){
                return "AZT";
            }else if(drug=='LAMIVUDINE'){
                return "3TC";
            }else if(drug=='ABACAVIR'){
                return "ABC";
            }else if(drug=='TENOFOVIR'){
                return "TDF";
            }else if(drug=='LOPINAVIR AND RITONAVIR'){
                return "LPV/r7";
            }else if(drug=='TRIMETHOPRIM AND SULFAMETHOXAZOLE'){
                return "Septrin";
            }else if(drug=='TRIMETHOPRIM AND SULFAMETHOXAZOLE'){
                return "Cipro";
            }else{
                return  drug[0] +drug.toLowerCase().slice(1);
            }
        };

        $.fn.slideFadeToggle = function(easing, callback) {
            return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
        };
        var mainDrug ="";
        var changeDrug="";
        var frequencyArrayLevel = {
            "CLEXANE": "levelTwo",
            "ENALAPRIL": "levelTwo",
            "HEPARIN": "levelThree",
            "CAPTOPRIL": "levelThree",
            "RAMIPRIL": "levelTwo",
            "LISINOPRIL": "levelTwo",
            "LOSARTAN": "levelTwo",
            "METOPROLOL": "levelThree",
            "ATENOLOL": "levelThree",
            "CARVEDILOL": "levelThree",
            "JUNIOR ASPIRIN": "levelThree",
            "ADULT ASPIRIN": "levelThree",
            "HYDROCHLOROTHIAZIDE": "levelTwo",
            "NIFEDIPINE": "levelTwo",
            "ATORVASTATIN": "levelOne",
            "SIMVASTATIN": "levelOne",
            "PARACETAMOL": "levelFour",
            "IBUPROFEN": "levelFour",
            "DICLOFENAC": "levelFour",
            "SPIRONOLACTONE": "levelTwo",
            "FUROSEMIDE": "levelFive",
            "RIFAMPICIN ISONIAZID PYRAZINAMIDE AND ETHAMBUTOL": "levelOne",
            "RIFAMPICIN ISONIAZID AND PYRAZINAMIDE": "levelOne",
            "RIFAMPICIN AND ISONIAZID": "levelOne",
            "NEVIRAPINE": "levelTwo",
            "EFAVIRENZ": "levelOne",
            "STAVUDINE": "levelTwo",
            "ZIDOVUDINE": "levelOne",
            "LAMIVUDINE": "levelTwo",
            "ABACAVIR": "levelOne",
            "TENOFOVIR": "levelOne",
            "LOPINAVIR AND RITONAVIR": "levelOne",
            "TRIMETHOPRIM AND SULFAMETHOXAZOLE": "levelFour",
            "CIPROFLOXACIN": "levelFour",
            "METRONIDAZOLE": "levelFour",
            "MACROLIDE": "levelFour",
            "ERYTHROMYCIN": "levelFour",
            "AZITHROMYCIN": "levelFour",
            "CLARYTHROMYCIN": "levelFour"
        };
        var frequencyArrayBD  = {
            "1891^ONCE A DAY^99DCT": "OD",
            "1888^TWICE A DAY^99DCT": "BD"
        };
        var frequencyArrayTDS  = {
            "1891^ONCE A DAY^99DCT": "OD",
            "1888^TWICE A DAY^99DCT": "BD",
            "1889^THREE TIMES A DAY^99DCT": "TDS"
        };
        var frequencyArrayPRN  = {
            "1891^ONCE A DAY^99DCT": "OD",
            "1888^TWICE A DAY^99DCT": "BD",
            "1889^THREE TIMES A DAY^99DCT": "TDS",
            "7772^AS NEEDED^99DCT": "PRN"
        };
        var frequencyArrayQID  = {
            "1891^ONCE A DAY^99DCT": "OD",
            "1888^TWICE A DAY^99DCT": "BD",
            "1889^THREE TIMES A DAY^99DCT": "TDS",
            "7772^AS NEEDED^99DCT": "PRN",
            "1890^FOUR TIMES A DAY^99DCT": "QID"
        };


        var doseArray  = {};
        doseArray["HEPARIN"] = {
            "5000": "5,000 mg",
            "7500": "7,500 mg",
            "10000": "10,000 mg",
            "12500": "12,500 mg"
        };
        doseArray["CLEXANE"] = {
            "30": "30 mg",
            "40": "40 mg",
            "60": "60 mg",
            "80": "80 mg",
            "100": "100 mg"
        };
        doseArray["ENALAPRIL"] = {
            "2.5": "2.5 mg",
            "5": "5 mg",
            "10": "10 mg",
            "20": "20 mg"
        };
        doseArray["CAPTOPRIL"] = {
            "12.5": "12.5 mg",
            "25": "25 mg",
            "50": "50 mg"
        };
        doseArray["RAMIPRIL"] = {
            "1.25": "1.25 mg",
            "2.5": "2.5 mg",
            "5": "5 mg",
            "10": "10 mg"
        };
        doseArray["LISINOPRIL"] = {
            "2.5": "2.5 mg",
            "5": "5 mg",
            "10": "10 mg",
            "20": "20 mg",
            "40": "40 mg"
        };
        doseArray["LOSARTAN"] = {
            "25": "25 mg",
            "50": "50 mg",
            "75": "75 mg",
            "100": "100 mg"
        };
        doseArray["METOPROLOL"] = {
            "12.5": "12.5 mg",
            "25": "25 mg",
            "50": "50 mg",
            "75": "75 mg",
            "100": "100 mg"
        };
        doseArray["ATENOLOL"] = {
            "25": "25 mg",
            "50": "50 mg",
            "75": "75 mg",
            "100": "100 mg"
        };
        doseArray["CARVEDILOL"] = {
            "3.125": "3.125 mg",
            "6.25": "6.25 mg",
            "12.5": "12.5 mg",
            "25": "25 mg"
        };
        doseArray["JUNIOR ASPIRIN"] = {
            "75": "75 mg",
            "325": "325 mg"
        };
        doseArray["ADULT ASPIRIN"] = {
            "75": "75 mg",
            "325": "325 mg"
        };
        doseArray["HYDROCHLOROTHIAZIDE"] = {
            "25": "25 mg",
            "12.5": "12.5 mg"
        };
        doseArray["NIFEDIPINE"] = {
            "20": "20 mg",
            "40": "40 mg"
        };
        doseArray["ATORVASTATIN"] = {
            "10": "10 mg",
            "20": "20 mg",
            "40": "40 mg",
            "60": "60 mg",
            "80": "80 mg"
        };
        doseArray["SIMVASTATIN"] = {
            "10": "10 mg",
            "20": "20 mg",
            "40": "40 mg",
            "60": "60 mg",
            "80": "80 mg"
        };
        doseArray["PARACETAMOL"] = {
            "500": "500 mg",
            "1000": "1000 mg",
            "150": "150 mg"
        };
        doseArray["IBUPROFEN"] = {
            "200": "200 mg",
            "400": "400 mg",
            "600": "600 mg",
            "200": "200 mg"
        };
        doseArray["DICLOFENAC"] = {
            "25": "25 mg",
            "50": "50 mg",
            "75": "75 mg"
        };
        doseArray["SPIRONOLACTONE"] = {
            "25": "25 mg",
            "50": "50 mg",
            "75": "75 mg",
            "100": "100 mg"
        };
        doseArray["RIFAMPICIN ISONIAZID PYRAZINAMIDE AND ETHAMBUTOL"] = {
            "2": "2 tabs",
            "3": "3 tabs",
            "4": "4 tabs"
        };
        doseArray["RIFAMPICIN ISONIAZID AND PYRAZINAMIDE"] = {
            "2": "2 tabs",
            "3": "3 tabs",
            "4": "4 tabs"
        };
        doseArray["RIFAMPICIN AND ISONIAZID"] = {
            "2": "2 tabs",
            "3": "3 tabs",
            "4": "4 tabs"
        };
        doseArray["NEVIRAPINE"] = {
            "200": "200 mg"
        };
        doseArray["EFAVIRENZ"] = {
            "600": "600 mg"
        };
        doseArray["STAVUDINE"] = {
            "30": "30 mg",
            "40": "40 mg"
        };
        doseArray["ZIDOVUDINE"] = {
            "300": "300 mg"
        };
        doseArray["LAMIVUDINE"] = {
            "150": "150 mg",
            "300": "300 mg"
        };
        doseArray["ABACAVIR"] = {
            "300": "300 mg"
        };
        doseArray["TENOFOVIR"] = {
            "300": "300 mg"
        };
        doseArray["LOPINAVIR AND RITONAVIR"] = {
            "2": "2 tabs",
            "3": "3 tabs"
        };
        doseArray["TRIMETHOPRIM AND SULFAMETHOXAZOLE"] = {
            "200": "200 mg",
            "400": "400 mg",
            "800": "800 mg"
        };
        doseArray["CIPROFLOXACIN"] = {
            "500": "500 mg"
        };
        doseArray["MACROLIDE"] = {
            "0": "0 mg"
        };
        doseArray["ERYTHROMYCIN"] = {
            "125": "125 mg",
            "250": "250 mg",
            "400": "400 mg",
            "500": "500 mg"
        };
        doseArray["AZITHROMYCIN"] = {
            "200": "200 mg",
            "500": "500 mg"
        };
        doseArray["CLARYTHROMYCIN"] = {
            "250": "250 mg",
            "500": "500 mg"
        };

        var theDialog = $("#myDialog").dialog({
            autoOpen:false,
            modal: false,
            width: '90%',
            height: 500,
            closeOnEscape: false,
            draggable: false,
            resizable: false,
            buttons: {}
        });
        (function($) {
            $.fn.MessageBox = function(drug,action) {
                return this.each(function(){
                    $('#drug_action_continue'+drug).prop('checked', false);
                    $('#drug_action_stop'+drug).prop('checked', false);
                    mainDrug =drug;
                    if(action=='more'){
                        $('#drug_action_change_down'+drug).prop('checked', false);
                        $('#current_medication_plan'+drug).val('6619^MORE^99DCT');
                    }else if(action=='less'){
                        $('#drug_action_change_up'+drug).prop('checked', false);
                        $('#current_medication_plan'+drug).val('6618^LESS^99DCT');
                    }
                    $( "#myDialog" ).dialog( "option", "title", "New Dose/Frequency for "+drug[0] +drug.toLowerCase().slice(1));
                    var select_change_frequency = $('#change_frequency');
                    var select_change_dose = $('#change_dose');
                    select_change_frequency.empty().append('<option value="">Select New Frequency</option>');
                    select_change_dose.empty().append('<option value="">Select New Dose</option>');
                    $.each(doseArray[drug] , function (k, v) {
                        select_change_dose.append($('<option>', {
                            value: k,
                            text: v
                        }));
                    })
                    $.each(frequencyArrayLevel, function (k, v) {
                        var filter = new RegExp('\\b' + drug + '\\b', 'gi');
                        if(k.match(filter)) {
                            if(v=="levelOne"){
                                select_change_frequency.append($('<option>', {
                                    value: "1891^ONCE A DAY^99DCT",
                                    text: "OD"
                                }));

                            }else if(v=="levelTwo"){
                                $.each(frequencyArrayBD , function (k, v) {
                                    select_change_frequency.append($('<option>', {
                                        value: k,
                                        text: v
                                    }));
                                })

                            }else if(v=="levelThree"){
                                $.each(frequencyArrayTDS , function (k, v) {
                                    select_change_frequency.append($('<option>', {
                                        value: k,
                                        text: v
                                    }));
                                })
                            }
                            else if(v=="levelFour"){
                                $.each(frequencyArrayPRN , function (k, v) {
                                    select_change_frequency.append($('<option>', {
                                        value: k,
                                        text: v
                                    }));
                                })
                            }
                            else if(v=="levelFive"){
                                $.each(frequencyArrayQID , function (k, v) {
                                    select_change_frequency.append($('<option>', {
                                        value: k,
                                        text: v
                                    }));
                                })
                            }
                        }
                    })
                    $("#myDialog").dialog("open");
                })
            };
        })(jQuery);

        (function($) {
            $.fn.continueRegime = function(drug) {
                return this.each(function(){
                    $('#drug_action_change_up'+drug).prop('checked', false);
                    $('#drug_action_change_down'+drug).prop('checked', false);
                    $('#drug_action_stop'+drug).prop('checked', false);
                    $('#current_medication_plan'+drug).val('1257^CONTINUE REGIMEN^99DCT');
                })
            };
        })(jQuery);

        $("#update_drug").click(function(){
            var frequency = $("#change_frequency").val();
            if(frequency=="1891^ONCE A DAY^99DCT") {
                frequency="OD";
            }else if(frequency=="1888^TWICE A DAY^99DCT"){
                frequency="BD";
            }else if(frequency=="1889^THREE TIMES A DAY^99DCT"){
                frequency="TDS";
            }
            if($("#change_dose").val() != ''){
                $('#current_medication_dose'+mainDrug).val($("#change_dose").val());
                $("#td_dose_"+mainDrug).html($("#change_dose").val());
            }
            if($("#change_frequency").val() !=''){
                $("#current_medication_frequency"+mainDrug).val($("#change_frequency").val());
                $("#td_frequency_"+mainDrug).html(frequency);
            }
            $("#myDialog").dialog('close');
        });
        $("#cancel_update").click(function(){
            $("#myDialog").dialog('close');
        });

        $("#dialog-confirm").position({
            my: "center",
            at: "center",
            of: window
        });

        (function($) {
            $.fn.deleteRow = function(tr_id,drug,radio_id,dose,frequency,start_date,stop_date) {
                return this.each(function(){
                    $('#drug_action_continue'+drug).prop('checked', false);
                    $('#drug_action_change_up'+drug).prop('checked', false);
                    $('#drug_action_change_down'+drug).prop('checked', false);
                    if($('#tmp_adherence'+drug).val()==''){
                        $("#dialog-confirm").html("Please select adherence in "+drug[0] +drug.toLowerCase().slice(1)+"" +
                                " for "+$("#patient\\.family_name").val());
                        $("#dialog-confirm").dialog({
                            resizable: false,
                            modal: true,
                            title: "To Stop Drug",
                            width: '98%',
                            closeOnEscape: false,
                            draggable: false,
                            autoReposition: true,
                            buttons: {
                                "Okay": function () {
                                    $(this).dialog('close');
                                    $("#"+radio_id).prop('checked', false);
                                }
                            }
                        });
                    }else{
                        $("#dialog-confirm").html("Are you sure you want to stop "+drug[0] +drug.toLowerCase().slice(1)+"" +
                                " for "+$("#patient\\.family_name").val());
                        $("#dialog-confirm").dialog({
                            resizable: false,
                            modal: true,
                            title: "Stopping Drug",
                            width: '90%',
                            resizable: false,
                            closeOnEscape: false,
                            draggable: false,
                            buttons: {
                                "Yes": function () {
                                    $(this).dialog('close');
                                    $('#current_medication_plan'+drug).val('1260^STOP ALL MEDICATIONS^99DCT');
                                    $('#current_medication_stop_date'+drug).val(currentDate);
                                    generateTableForPostedStopped(drug.replace(/_/g," "),dose,
                                            frequency,start_date,currentDate,"stopped_medication");
                                    $("#"+tr_id).remove();
                                },
                                "No": function () {
                                    $(this).dialog('close');
                                    $("#"+radio_id).prop('checked', false);
                                }
                            }
                        });
                    }
                })
            };
        })(jQuery);

        (function($) {
            $.fn.getSelectValue = function(drug) {
                drug=drug.replace(/ /g,"_");
                return this.each(function(){
                    $('#current_medication_adherence'+drug).val($('#tmp_adherence'+drug).val());
                    appendingDrugConcept(drug);
                })
            };
        })(jQuery);

        var drugs = {
            "#UFH": "8893^HEPARIN^99DCT",
            "#Enoxaparin": "8835^CLEXANE^99DCT",
            "#Enalapril": "1242^ENALAPRIL^99DCT",
            "#Captopril": "8835^CAPTOPRIL^99DCT",
            "#Ramipril": "2263^RAMIPRIL^99DCT",
            "#Lisinopril": "2264^LISINOPRIL^99DCT",
            "#Losartan": "2265^LOSARTAN^99DCT",
            "#Metoprolol": "2266^METOPROLOL^99DCT",
            "#Atenolol": "2266^ATENOLOL^99DCT",
            "#Carvedilol": "2268^CARVEDILOL^99DCT",
            "#Asprin(Junior)": "7303^JUNIOR ASPIRIN^99DCT",
            "#Asprin(Adult)": "88^ASPIRIN^99DCT",
            "#HCTZ": "1243^HYDROCHLOROTHIAZIDE^99DCT",
            "#Nifedipine": "250^NIFEDIPINE^99DCT",
            "#Atorvastatin": "2276^ATORVASTATIN^99DCT",
            "#Simvastatin": "2277^ATORVASTATIN^99DCT",
            "#Paracetamol": "89^PARACETAMOL^99DCT",
            "#Ibuprofen": "912^IBUPROFEN^99DCT",
            "#Diclofenac": "436^DICLOFENAC^99DCT",
            "#Aldactone": "2269^SPIRONOLACTONE^99DCT",
            "#Furosemide": "99^FUROSEMIDE^99DCT",
            "#RHZE": "1131^RIFAMPICIN ISONIAZID PYRAZINAMIDE AND ETHAMBUTOL^99DCT",
            "#Rifater": "768^RIFAMPICIN ISONIAZID AND PYRAZINAMIDE^99DCT",
            "#RH": "1194^RIFAMPICIN AND ISONIAZID^99DCT",
            "#NVP": "631^NEVIRAPINE^99DCT",
            "#EFV": "633^EFAVIRENZ^99DCT",
            "#D4t": "625^STAVUDINE^99DCT",
            "#AZT": "797^ZIDOVUDINE^99DCT",
            "#3TC": "628^LAMIVUDINE^99DCT",
            "#ABC": "814^ABACAVIR^99DCT",
            "#TDF": "802^TENOFOVIR^99DCT",
            "#LPV/r7": "794^LOPINAVIR AND RITONAVIR^99DCT",
            "#Septrin": "916^TRIMETHOPRIM AND SULFAMETHOXAZOLE^99DCT",
            "#Cipro": "740^CIPROFLOXACIN^99DCT",
            "#Metronidazole": "237^METRONIDAZOLE^99DCT",
            "#Macrolide": "8894^MACROLIDE^99DCT",
            "#Erythromycin": "272^ERYTHROMYCIN^99DCT",
            "#Azithromycin": "735^AZITHROMYCIN^99DCT",
            "#Clarythromycin": "8922^CLARYTHROMYCIN^99DCT"
        }
        var appendingDrugConcept = function (drug) {

            $.each(drugs, function (k, v) {
                var filter = new RegExp('\\b' + drug.replace(/_/g," ") + '\\b', 'gi');
                if(v.match(filter)) {
                    $("#current_medication_added"+drug).val(v);
                }
            })
        };

        var generateTable = function(drug,dose,frequency,start_date,name) {
            frequency = trimFrequency(frequency);

            var innerDrug = trimDrug(drug);
            changeDrug =drug;
            drug=drug.replace(/ /g,"_");
            var dynamicContent=
                    '<tr id="drug_row'+drug+'">' +
                    '<td>'+innerDrug+'</td>' +
                    '<td id ="td_dose_'+drug+'">'+dose+'</td>' +
                    '<td id ="td_frequency_'+drug+'">'+frequency+'</td>' +
                    '<td>'+start_date+'</td> ' +
                    '<td> ' +
                    '<div class="form-group">'+//here
                    '<span>'+
                    '<strong><span class="required"></span></strong>'+
                    '</span>'+
                    '<div class="form-group" > ' +
                    '<label class="font-normal">' +
                    '<input id="drug_action_continue'+drug+'" type="radio"' +
                    'onClick=\"$(this).continueRegime(\''+drug+'\')\" />' +
                    'Cont ' +
                    '</label> ' +
                    '</div> ' +
                    '</td> ' +
                    '<td> ' +
                    '<div class="form-group"> ' +
                    '<label class="font-normal"> ' +
                    '<input  id="drug_action_change_up'+drug+'" type="radio"' +
                    'onClick=\"$(this).MessageBox(\''+drug+'\',\'more\')\" />' +
                    '&#9650;' +
                    '</label> ' +
                    '</div>' +
                    '</td>' +
                    '<td>' +
                    '<div class="form-group">' +
                    '<label class="font-normal">' +
                    '<input id="drug_action_change_down'+drug+'" type="radio"' +
                    'onClick=\"$(this).MessageBox(\''+drug+'\',\'less\')\"/> ' +
                    '&#9660;' +
                    '</label> ' +
                    '</div> ' +
                    '</td>' +
                    '<td> ' +
                    '<div class="form-group"> ' +
                    '<label class="font-normal"> ' +
                    '<input id="drug_action_stop'+drug+'" type="radio"' +
                    'onClick=\"$(this).deleteRow(\'drug_row'+drug+'\',\''+drug+'\',\'drug_action_stop'+drug+'\'' +
                    ',\''+dose+'\',\''+frequency+'\',\''+start_date+'\')\"/>  ' +
                    'Stop' +
                    '</label>' +
                    '</div> ' +
                    '</div>' +//stop
                    '</td> ' +
                    '<td><select class="form-control" id="tmp_adherence'+drug+'"' +
                    'onchange=\"$(this).getSelectValue(\''+drug+'\')\">' +
                    '<option value="">...</option>' +
                    '<option value="1107^NONE^99DCT">None</option>' +
                    '<option value="1160^FEW^99DCT">Few</option> ' +
                    '<option value="1161^HALF^99DCT">Half</option>' +
                    '<option value="1162^MOST^99DCT">Most</option> ' +
                    '<option value="1163^ALL^99DCT">All</option> ' +
                    '</select>' +
                    '</tr>';
            $("#current_medication").append(dynamicContent);
        };
        var currentMedications = new Array();
        var currentMedicationsFrequency = new Array();
        var currentMedicationsDose = new Array();
        var currentMedicationsStartDate = new Array();
        var stoppedMedications = new Array();
        var stoppedMedicationsFrequency = new Array();
        var stoppedMedicationsDose = new Array();
        var stoppedMedicationsStartDate = new Array();
        var stoppedMedicationsStopDate = new Array();
        var medications  = function () {
            currentMedications = $.fn.currentMedication();
            currentMedicationsFrequency = $.fn.medicationFrequency();
            currentMedicationsDose = $.fn.medicationDose();
            currentMedicationsStartDate = $.fn.medicationStartDate();
            stoppedMedicationsDose = $.fn.stoppedMedicationsDose();

            $.each(drugs, function (index,drug) {
                var innerDrug = drug.substring(drug.indexOf("^")+1,drug.length-6);

                //                check if new drug exist
                if ($('#new_medication_added'+innerDrug).existsWithValue()) {
                    //                    load to table
                    generateTableForPosted(innerDrug, $('#new_medication_dose'+innerDrug).val(),
                            $('#new_medication_frequency'+innerDrug).val(),$('#new_medication_start_date'+innerDrug).val(),"new_medication");
                }

                if($.inArray(innerDrug, currentMedications) > -1){
                    $.each(currentMedications, function(key, name) {
                        if (name === innerDrug){
                            generateTable(innerDrug,currentMedicationsDose[key],currentMedicationsFrequency[key],
                                    currentMedicationsStartDate[key],name);
                            if ($('#current_medication_dose'+name).existsWithValue()) {
                                $("#td_dose_"+name).html($('#current_medication_dose'+name).val());
                            }
                            if ($('#current_medication_frequency'+name).existsWithValue()) {
                                $("#td_frequency_"+name).html(trimFrequency($('#current_medication_frequency'+name).val()));
                            }
                            if ($('#current_medication_adherence'+name).existsWithValue()) {
                                $("#tmp_adherence"+name).val(($('#current_medication_adherence'+name).val()));
                            }
                            if ($('#current_medication_plan'+name).existsWithValue()) {
                                var plan = $('#current_medication_plan'+name).val();
                                if(plan == '6619^MORE^99DCT'){
                                    $('#drug_action_change_up'+name).prop("checked", true);
                                }else if(plan == '6618^LESS^99DCT'){
                                    $('#drug_action_change_down'+name).prop("checked", true);
                                }else if(plan == '1257^CONTINUE REGIMEN^99DCT'){
                                    $('#drug_action_continue'+name).prop("checked", true);
                                }else if(plan == '1260^STOP ALL MEDICATIONS^99DCT'){
                                    generateTableForPostedStopped(changeDrug,currentMedicationsDose[key],
                                            currentMedicationsFrequency[key],currentMedicationsStartDate[key],stoppedMedicationsDose[key],"stopped_medication");
                                    $('#drug_row'+changeDrug).remove();
                                }
                            }
                        }
                    });
                }
            });
        };medications();

        var stoppedMedications  = function () {
            stoppedMedications = $.fn.stoppedMedications();
            stoppedMedicationsFrequency = $.fn.stoppedMedicationFrequency();
            stoppedMedicationsDose = $.fn.stoppedMedicationsDose();
            stoppedMedicationsStartDate = $.fn.stoppedMedicationsStartDate();
            stoppedMedicationsStopDate = $.fn.stoppedMedicationsStopDate();

            $.each(drugs, function (index,drug) {
                var innerDrug = drug.substring(drug.indexOf("^")+1,drug.length-6);

                if($.inArray(innerDrug, stoppedMedications) > -1){
                    $.each(stoppedMedications, function(key, name) {
                        if (name === innerDrug){
                            generateTableForPostedStopped(innerDrug,stoppedMedicationsDose[key],
                                    stoppedMedicationsFrequency[key],stoppedMedicationsStartDate[key],stoppedMedicationsStopDate[key],"stopped_medication");
                        }
                    });
                }
            });
        };stoppedMedications();
        var medicationDrugs = [
            {"label": "UFH", "val": "8893^HEPARIN^99DCT"},
            {"label": "Enoxaparin", "val": "8835^CLEXANE^99DCT"},
            {"label": "Enalapril", "val": "1242^ENALAPRIL^99DCT"},
            {"label": "Captopril", "val": "8835^CAPTOPRIL^99DCT"},
            {"label": "Ramipril", "val": "2263^RAMIPRIL^99DCT"},
            {"label": "Lisinopril", "val": "2264^LISINOPRIL^99DCT"},
            {"label": "Losartan", "val": "2265^LOSARTAN^99DCT"},
            {"label": "Metoprolol", "val": "2266^METOPROLOL^99DCT"},
            {"label": "Atenolol", "val": "2266^ATENOLOL^99DCT"},
            {"label": "Carvedilol", "val": "2268^CARVEDILOL^99DCT"},
            {"label": "Asprin(Junior)", "val": "7303^JUNIOR ASPIRIN^99DCT"},
            {"label": "Asprin(Adult)", "val": "88^ASPIRIN^99DCT"},
            {"label": "HCTZ", "val": "1243^HYDROCHLOROTHIAZIDE^99DCT"},
            {"label": "Nifedipine", "val": "250^NIFEDIPINE^99DCT"},
            {"label": "Atorvastatin", "val": "2276^ATORVASTATIN^99DCT"},
            {"label": "Simvastatin", "val": "2277^ATORVASTATIN^99DCT"},
            {"label": "Paracetamol", "val": "89^PARACETAMOL^99DCT"},
            {"label": "Ibuprofen", "val": "912^IBUPROFEN^99DCT"},
            {"label": "Diclofenac", "val": "436^DICLOFENAC^99DCT"},
            {"label": "Aldactone", "val": "2269^SPIRONOLACTONE^99DCT"},
            {"label": "Furosemide", "val": "99^FUROSEMIDE^99DCT"},
            {"label": "RHZE", "val": "1131^RIFAMPICIN ISONIAZID PYRAZINAMIDE AND ETHAMBUTOL^99DCT"},
            {"label": "Rifater", "val": "768^RIFAMPICIN ISONIAZID AND PYRAZINAMIDE^99DCT"},
            {"label": "RH", "val": "1194^RIFAMPICIN AND ISONIAZID^99DCT"},
            {"label": "NVP", "val": "631^NEVIRAPINE^99DCT"},
            {"label": "EFV", "val": "633^EFAVIRENZ^99DCT"},
            {"label": "D4t", "val": "625^STAVUDINE^99DCT"},
            {"label": "AZT", "val": "797^ZIDOVUDINE^99DCT"},
            {"label": "3TC", "val": "628^LAMIVUDINE^99DCT"},
            {"label": "ABC", "val": "814^ABACAVIR^99DCT"},
            {"label": "TDF", "val": "802^TENOFOVIR^99DCT"},
            {"label": "LPV/r7", "val": "794^LOPINAVIR AND RITONAVIR^99DCT"},
            {"label": "Septrin", "val": "916^TRIMETHOPRIM AND SULFAMETHOXAZOLE^99DCT"},
            {"label": "Cipro", "val": "740^CIPROFLOXACIN^99DCT"},
            {"label": "Metronidazole", "val": "237^METRONIDAZOLE^99DCT"},
            {"label": "Macrolide", "val": "8894^MACROLIDE^99DCT"},
            {"label": "Erythromycin", "val": "272^ERYTHROMYCIN^99DCT"},
            {"label": "Azithromycin", "val": "735^AZITHROMYCIN^99DCT"},
            {"label": "Clarythromycin", "val": "8922^CLARYTHROMYCIN^99DCT"}
        ];
        $('#new_drug_name').autocomplete({
            source: medicationDrugs,
            create: function (event, ui) {
                var medication_val = $('input[id="new_drug_name"]').val();
                $.each(medicationDrugs, function (i, elem) {
                    if (elem.val == medication_val) {
                        $('#new_drug_name').val(elem.label)
                    }
                });
            },
            select: function (event, ui) {
                $('input[id="new_drug_name"]').val(ui.item.val);
                $('#new_drug_name').val(ui.item.label);
                $('#new_drug_name_concept').val(ui.item.val);
                $('#new_drug_dosage').empty().append('<option value="">Select New Dose</option>');
                $('#new_drug_frequency').empty().append('<option value="">Select New frequency</option>');
                $('#post_added_medication_div').addClass('hidden');
                var drug = ui.item.val.substring(ui.item.val.indexOf("^")+1,ui.item.val.length-6);
                $.each(doseArray[drug] , function (k, v) {
                    $('#new_drug_dosage').append($('<option>', {
                        value: k,
                        text: v
                    }));
                })
                $.each(frequencyArrayLevel, function (k, v) {
                    var filter = new RegExp('\\b' + drug + '\\b', 'gi');
                    if(k.match(filter)) {
                        if(v=="levelOne"){
                            $('#new_drug_frequency').empty().append('<option value="">Select New frequency</option>');
                            $('#new_drug_frequency').append($('<option>', {
                                value: "1891^ONCE A DAY^99DCT",
                                text: "OD"
                            }));

                        }else if(v=="levelTwo"){
                            $('#new_drug_frequency').empty().append('<option value="">Select New frequency</option>');
                            $.each(frequencyArrayBD , function (k, v) {
                                $('#new_drug_frequency').append($('<option>', {
                                    value: k,
                                    text: v
                                }));
                            })

                        }else if(v=="levelThree"){
                            $('#new_drug_frequency').empty().append('<option value="">Select New frequency</option>');
                            $.each(frequencyArrayTDS , function (k, v) {
                                $('#new_drug_frequency').append($('<option>', {
                                    value: k,
                                    text: v
                                }));
                            })
                        }
                    }
                })
                return false;
            }
        });
        $('#new_drug_name').change(function () {
            if ($('#new_drug_name').val() === '') {
                $('#new_drug_dosage').val('');
                $('#new_drug_dosage').empty().append('<option value="">Select New Dose</option>');
                $('#post_added_medication_div').addClass('hidden');
            }
        });
        $('#new_drug_dosage').change(function () {
            if ($('#new_drug_dosage').val() === ''|| $('#new_drug_frequency').val() === ''
                    || $('#drug_plan_start_date').val() === '') {
                $('#post_added_medication_div').addClass('hidden');
            }
            else{
                $('#post_added_medication_div').removeClass('hidden');
            }
        });
        $('#new_drug_frequency').change(function () {
            if ($('#new_drug_dosage').val() === ''|| $('#new_drug_frequency').val() === ''
                    || $('#drug_plan_start_date').val() === '') {
                $('#post_added_medication_div').addClass('hidden');
            }
            else{
                $('#post_added_medication_div').removeClass('hidden');
            }
        });
        $('#drug_plan_start_date').change(function () {
            if ($('#new_drug_dosage').val() === ''|| $('#new_drug_frequency').val() === ''
                    || $('#drug_plan_start_date').val() === '') {
                $('#post_added_medication_div').addClass('hidden');
            }
            else{
                $('#post_added_medication_div').removeClass('hidden');
            }
        });

        var addDrug = function(drug,dose,frequency,start_date) {
            var innerDrug = drug.substring(drug.indexOf("^")+1,drug.length-6).replace(/ /g,"_");
            $('#new_medication_added'+innerDrug).val(drug);
            $('#new_medication_dose'+innerDrug).val(dose);
            $('#new_medication_frequency'+innerDrug).val(frequency);
            $('#new_medication_start_date'+innerDrug).val(start_date);

        };
        $('#post_added_medication').change(function () {
            if ($(this).is(':checked')) {
                addDrug($('#new_drug_name_concept').val(), $('#new_drug_dosage').val(), $('#new_drug_frequency').val(),
                        $('#drug_plan_start_date').val(),currentDate);
                generateTableForPosted($('#new_drug_name').val(),$('#new_drug_dosage').val(),
                        $('#new_drug_frequency').val(),$('#drug_plan_start_date').val(),"new_medication");
                $('#new_drug_name').val(''); $('#new_drug_dosage').val(''); $('#new_drug_frequency').val('');
                $('#new_drug_name_concept').val('');
                $("#post_added_medication").prop('checked', false);
                deselect($('#contact'));
            }
        });


        //        end of medication summary




        //    my code
        /* Start - Checking that the diastolic blood pressure is less than the systolic blood pressure */
        $.validator.addMethod("lessThankSystolic", function (value, element) {
                    if($.fn.isNotRequiredAndEmpty(value,element)) return true;
                    var systolicBloodPressure = parseInt($(element).closest('.section').find('.systolicBloodPressure').val());
                    return (parseInt(value) <= systolicBloodPressure);
                }, "DBP cannot be more than Systolic Blood Pressure."
        );

        // attach 'lessThankSystolic' class to perform validation.
        jQuery.validator.addClassRules({
            lessThankSystolic: { lessThankSystolic: true }
        });
        /* End - lessThankSystolic*/

        var checkBoxExtraOption = function () {
            var objectArray = {
                "#referrals_ordered_xray": "#referrals_ordered_xray_div",
                "#additional_labs": "#lab_results",
                "#referrals_ordered_other": "#referrals_ordered_other_quiz",
                "#other_complains": "#other_complains_quiz"
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
        };
        checkBoxExtraOption();





    });
