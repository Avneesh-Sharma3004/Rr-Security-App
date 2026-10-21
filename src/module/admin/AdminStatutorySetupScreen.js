import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  setActiveStatutorySubTab,
  toggleModuleStatus,
  updateModuleConfig,
  savePfSettings,
  togglePfModuleStatus,
  saveEsiSettings,
  toggleEsiModuleStatus,
  setPtStateFilter,
  setPtSearchQuery,
  addPtSlab,
  editPtSlab,
  deletePtSlab,
  togglePtSlabStatus,
  saveTdsSettings,
  toggleTdsModuleStatus,
  saveBonusSettings,
  toggleBonusModuleStatus,
  saveGratuitySettings,
  toggleGratuityModuleStatus,
  setLwfStateFilter,
  toggleLwfModuleStatus,
  addLwfRule,
  editLwfRule,
  deleteLwfRule,
  toggleLwfRuleStatus,
} from "../../store/slices/statutorySlice";
import { toggleDrawer } from "../../store/slices/dashboardSlice";
import { useAuth } from "../../hooks/UseAuth";

export default function AdminStatutorySetupScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useAuth();

  const {
    activeStatutorySubTab,
    modules,
    pfSettings,
    esiSettings,
    ptSlabs,
    ptStateFilter,
    ptSearchQuery,
    tdsSettings,
    bonusSettings,
    gratuitySettings,
    lwfRules,
    lwfStateFilter,
    lwfModuleStatus,
  } = useSelector((state) => state.statutory);

  // Sub tabs list
  const subTabsList = [
    "Overview",
    "PF (Provident Fund)",
    "ESI",
    "PT (Professional Tax)",
    "TDS",
    "Bonus",
    "Gratuity",
    "Labour Welfare Fund(LWF)",
  ];

  // -------------------------------------------------------------
  // 1. PF FORM STATE
  // -------------------------------------------------------------
  const [pfEmpContrib, setPfEmpContrib] = useState(pfSettings?.employeeContribution || "12");
  const [pfEmprContrib, setPfEmprContrib] = useState(pfSettings?.employerContribution || "12");
  const [pfCeiling, setPfCeiling] = useState(pfSettings?.wageCeiling || "25000");
  const [pfDate, setPfDate] = useState(pfSettings?.effectiveDate || "09/01/2026");
  const [pfVpf, setPfVpf] = useState(
    pfSettings?.vpfOption || "Allowed (Employees can contribute beyond 12%)"
  );
  const [pfRestrictCeiling, setPfRestrictCeiling] = useState(
    pfSettings?.restrictWageCeiling || "Yes (Calculate maximum on ₹15,000)"
  );
  const [showVpfModal, setShowVpfModal] = useState(false);
  const [showRestrictModal, setShowRestrictModal] = useState(false);

  useEffect(() => {
    if (pfSettings) {
      setPfEmpContrib(pfSettings.employeeContribution || "12");
      setPfEmprContrib(pfSettings.employerContribution || "12");
      setPfCeiling(pfSettings.wageCeiling || "25000");
      setPfDate(pfSettings.effectiveDate || "09/01/2026");
      setPfVpf(pfSettings.vpfOption || "Allowed (Employees can contribute beyond 12%)");
      setPfRestrictCeiling(
        pfSettings.restrictWageCeiling || "Yes (Calculate maximum on ₹15,000)"
      );
    }
  }, [pfSettings]);

  // -------------------------------------------------------------
  // 2. ESI FORM STATE
  // -------------------------------------------------------------
  const [esiEmpContrib, setEsiEmpContrib] = useState(esiSettings?.employeeContribution || "0.75");
  const [esiEmprContrib, setEsiEmprContrib] = useState(esiSettings?.employerContribution || "3.25");
  const [esiWageLimit, setEsiWageLimit] = useState(esiSettings?.wageEligibilityLimit || "21000");
  const [esiDisabilityLimit, setEsiDisabilityLimit] = useState(
    esiSettings?.disabilityWageLimit || "25000"
  );
  const [esiDate, setEsiDate] = useState(esiSettings?.effectiveDate || "04/01/2026");

  useEffect(() => {
    if (esiSettings) {
      setEsiEmpContrib(esiSettings.employeeContribution || "0.75");
      setEsiEmprContrib(esiSettings.employerContribution || "3.25");
      setEsiWageLimit(esiSettings.wageEligibilityLimit || "21000");
      setEsiDisabilityLimit(esiSettings.disabilityWageLimit || "25000");
      setEsiDate(esiSettings.effectiveDate || "04/01/2026");
    }
  }, [esiSettings]);

  // -------------------------------------------------------------
  // 3. PT STATE & MODALS
  // -------------------------------------------------------------
  const [ptModalVisible, setPtModalVisible] = useState(false);
  const [editingPtSlab, setEditingPtSlab] = useState(null);
  const [showPtStateFilterModal, setShowPtStateFilterModal] = useState(false);

  const [ptFormState, setPtFormState] = useState("Maharashtra");
  const [ptFormSalaryRange, setPtFormSalaryRange] = useState("₹10,001 - Above");
  const [ptFormMonthlyTax, setPtFormMonthlyTax] = useState("₹200 / month");
  const [ptFormFebSpecialRate, setPtFormFebSpecialRate] = useState("Same as Regular");
  const [ptFormEffectiveDate, setPtFormEffectiveDate] = useState("2026-04-01");

  const stateOptions = [
    "All States",
    "Haryana",
    "West Bengal",
    "Maharashtra",
    "Karnataka",
    "Telangana",
    "Tamil Nadu",
    "Gujarat",
  ];

  // -------------------------------------------------------------
  // 4. TDS FORM STATE
  // -------------------------------------------------------------
  const [tdsRegime, setTdsRegime] = useState(
    tdsSettings?.defaultTaxRegime || "New Tax Regime (Section 115BAC - Default)"
  );
  const [tdsFinancialYear, setTdsFinancialYear] = useState(
    tdsSettings?.effectiveFinancialYear || "FY 2026-2027 (AY 2027-2028)"
  );
  const [tdsStdNew, setTdsStdNew] = useState(tdsSettings?.standardDeductionNew || "75000");
  const [tdsStdOld, setTdsStdOld] = useState(tdsSettings?.standardDeductionOld || "50000");
  const [tdsRequireDecl, setTdsRequireDecl] = useState(
    tdsSettings?.requireInvestmentDeclaration || "Yes (Enable 80C, 80D, HRA proof submissions)"
  );
  const [tdsDeadline, setTdsDeadline] = useState(
    tdsSettings?.proofSubmissionDeadline || "01/31/2027"
  );
  const [showTdsRegimeModal, setShowTdsRegimeModal] = useState(false);
  const [showTdsFyModal, setShowTdsFyModal] = useState(false);
  const [showTdsDeclModal, setShowTdsDeclModal] = useState(false);

  useEffect(() => {
    if (tdsSettings) {
      setTdsRegime(tdsSettings.defaultTaxRegime || "New Tax Regime (Section 115BAC - Default)");
      setTdsFinancialYear(tdsSettings.effectiveFinancialYear || "FY 2026-2027 (AY 2027-2028)");
      setTdsStdNew(tdsSettings.standardDeductionNew || "75000");
      setTdsStdOld(tdsSettings.standardDeductionOld || "50000");
      setTdsRequireDecl(
        tdsSettings.requireInvestmentDeclaration ||
          "Yes (Enable 80C, 80D, HRA proof submissions)"
      );
      setTdsDeadline(tdsSettings.proofSubmissionDeadline || "01/31/2027");
    }
  }, [tdsSettings]);

  // -------------------------------------------------------------
  // 5. BONUS FORM STATE
  // -------------------------------------------------------------
  const [bonusCalcMethod, setBonusCalcMethod] = useState(
    bonusSettings?.calculationMethod || "Percentage of Basic Salary"
  );
  const [bonusRate, setBonusRate] = useState(bonusSettings?.bonusRate || "8.33");
  const [bonusCeiling, setBonusCeiling] = useState(bonusSettings?.wageCeiling || "7000");
  const [bonusMinDays, setBonusMinDays] = useState(bonusSettings?.minServiceDays || "30");
  const [bonusDisbursement, setBonusDisbursement] = useState(
    bonusSettings?.disbursementSchedule || "Annual (Diwali / Puja Festival)"
  );
  const [bonusEffectiveDate, setBonusEffectiveDate] = useState(
    bonusSettings?.effectiveDate || "04/01/2026"
  );
  const [showBonusCalcModal, setShowBonusCalcModal] = useState(false);

  useEffect(() => {
    if (bonusSettings) {
      setBonusCalcMethod(bonusSettings.calculationMethod || "Percentage of Basic Salary");
      setBonusRate(bonusSettings.bonusRate || "8.33");
      setBonusCeiling(bonusSettings.wageCeiling || "7000");
      setBonusMinDays(bonusSettings.minServiceDays || "30");
      setBonusDisbursement(
        bonusSettings.disbursementSchedule || "Annual (Diwali / Puja Festival)"
      );
      setBonusEffectiveDate(bonusSettings.effectiveDate || "04/01/2026");
    }
  }, [bonusSettings]);

  // -------------------------------------------------------------
  // 6. GRATUITY FORM STATE
  // -------------------------------------------------------------
  const [gratPeriodYears, setGratPeriodYears] = useState(
    gratuitySettings?.eligibilityPeriodYears || "5"
  );
  const [gratCalcBasis, setGratCalcBasis] = useState(
    gratuitySettings?.calculationBasis || "Basic Salary + Dearness Allowance (DA)"
  );
  const [gratMaxExempt, setGratMaxExempt] = useState(
    gratuitySettings?.maxTaxExemptionLimit || "2000000"
  );
  const [gratEffectiveDate, setGratEffectiveDate] = useState(
    gratuitySettings?.effectiveDate || "04/01/2026"
  );
  const [showGratBasisModal, setShowGratBasisModal] = useState(false);

  useEffect(() => {
    if (gratuitySettings) {
      setGratPeriodYears(gratuitySettings.eligibilityPeriodYears || "5");
      setGratCalcBasis(
        gratuitySettings.calculationBasis || "Basic Salary + Dearness Allowance (DA)"
      );
      setGratMaxExempt(gratuitySettings.maxTaxExemptionLimit || "2000000");
      setGratEffectiveDate(gratuitySettings.effectiveDate || "04/01/2026");
    }
  }, [gratuitySettings]);

  // -------------------------------------------------------------
  // 7. LABOUR WELFARE FUND (LWF) STATE (SCREENSHOT)
  // -------------------------------------------------------------
  const [showLwfStateFilterModal, setShowLwfStateFilterModal] = useState(false);
  const [lwfModalVisible, setLwfModalVisible] = useState(false);
  const [editingLwfRule, setEditingLwfRule] = useState(null);

  const [lwfFormState, setLwfFormState] = useState("Haryana");
  const [lwfFormEmpShare, setLwfFormEmpShare] = useState("25");
  const [lwfFormEmprShare, setLwfFormEmprShare] = useState("50");
  const [lwfFormFrequency, setLwfFormFrequency] = useState("Monthly");
  const [lwfFormDeductionMonths, setLwfFormDeductionMonths] = useState("Every Month");
  const [lwfFormEffectiveDate, setLwfFormEffectiveDate] = useState("2026-04-01");
  const [showLwfFreqModal, setShowLwfFreqModal] = useState(false);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleMastersComponents = () => {
    Alert.alert(
      "Masters Components",
      "Navigating to Statutory Rule & Component Masters configuration."
    );
  };

  const handleToggleOverviewModule = (module) => {
    const nextStatus = module.status === "Enabled" ? "Disabled" : "Enabled";
    Alert.alert(
      "Toggle Compliance Rule",
      `Are you sure you want to set ${module.title} to ${nextStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Mark ${nextStatus}`,
          onPress: () => {
            dispatch(toggleModuleStatus(module.id));
          },
        },
      ]
    );
  };

  const handleConfigureModule = (module) => {
    if (module.id === "pf") {
      dispatch(setActiveStatutorySubTab("PF (Provident Fund)"));
    } else if (module.id === "esi") {
      dispatch(setActiveStatutorySubTab("ESI"));
    } else if (module.id === "pt") {
      dispatch(setActiveStatutorySubTab("PT (Professional Tax)"));
    } else if (module.id === "tds") {
      dispatch(setActiveStatutorySubTab("TDS"));
    } else if (module.id === "bonus") {
      dispatch(setActiveStatutorySubTab("Bonus"));
    } else if (module.id === "gratuity") {
      dispatch(setActiveStatutorySubTab("Gratuity"));
    }
  };

  // PF Save
  const handleSavePf = () => {
    if (!pfEmpContrib.trim() || !pfEmprContrib.trim() || !pfCeiling.trim() || !pfDate.trim()) {
      Alert.alert("Validation Error", "Please fill all required PF fields marked with *");
      return;
    }
    dispatch(
      savePfSettings({
        employeeContribution: pfEmpContrib.trim(),
        employerContribution: pfEmprContrib.trim(),
        wageCeiling: pfCeiling.trim(),
        effectiveDate: pfDate.trim(),
        vpfOption: pfVpf,
        restrictWageCeiling: pfRestrictCeiling,
        updatedBy: user?.name || "Admin",
      })
    );
    Alert.alert("Success", "Provident Fund (PF) Settings updated successfully!");
  };

  // ESI Save
  const handleSaveEsi = () => {
    if (
      !esiEmpContrib.trim() ||
      !esiEmprContrib.trim() ||
      !esiWageLimit.trim() ||
      !esiDisabilityLimit.trim() ||
      !esiDate.trim()
    ) {
      Alert.alert("Validation Error", "Please fill all required ESI fields marked with *");
      return;
    }
    dispatch(
      saveEsiSettings({
        employeeContribution: esiEmpContrib.trim(),
        employerContribution: esiEmprContrib.trim(),
        wageEligibilityLimit: esiWageLimit.trim(),
        disabilityWageLimit: esiDisabilityLimit.trim(),
        effectiveDate: esiDate.trim(),
        updatedBy: user?.name || "Admin",
      })
    );
    Alert.alert("Success", "Employee State Insurance (ESI) Settings updated successfully!");
  };

  // PT Handlers
  const handleOpenAddPtSlab = () => {
    setEditingPtSlab(null);
    setPtFormState("Maharashtra");
    setPtFormSalaryRange("₹10,001 - Above");
    setPtFormMonthlyTax("₹200 / month");
    setPtFormFebSpecialRate("Same as Regular");
    setPtFormEffectiveDate("2026-04-01");
    setPtModalVisible(true);
  };

  const handleOpenEditPtSlab = (slab) => {
    setEditingPtSlab(slab);
    setPtFormState(slab.state);
    setPtFormSalaryRange(slab.salaryRange);
    setPtFormMonthlyTax(slab.monthlyTax);
    setPtFormFebSpecialRate(slab.febSpecialRate || "Same as Regular");
    setPtFormEffectiveDate(slab.effectiveDate || "2026-04-01");
    setPtModalVisible(true);
  };

  const handleSavePtSlab = () => {
    if (!ptFormSalaryRange.trim() || !ptFormMonthlyTax.trim()) {
      Alert.alert("Validation Error", "Please provide salary range and monthly tax amount.");
      return;
    }
    if (editingPtSlab) {
      dispatch(
        editPtSlab({
          id: editingPtSlab.id,
          state: ptFormState,
          salaryRange: ptFormSalaryRange.trim(),
          monthlyTax: ptFormMonthlyTax.trim(),
          febSpecialRate: ptFormFebSpecialRate.trim(),
          effectiveDate: ptFormEffectiveDate.trim(),
        })
      );
      Alert.alert("Updated", `PT slab for ${ptFormState} updated successfully.`);
    } else {
      dispatch(
        addPtSlab({
          state: ptFormState,
          salaryRange: ptFormSalaryRange.trim(),
          monthlyTax: ptFormMonthlyTax.trim(),
          febSpecialRate: ptFormFebSpecialRate.trim(),
          effectiveDate: ptFormEffectiveDate.trim(),
          status: "Active",
        })
      );
      Alert.alert("Added", `New PT slab for ${ptFormState} created successfully.`);
    }
    setPtModalVisible(false);
  };

  const handleDeletePtSlab = (slab) => {
    Alert.alert(
      "Delete PT Slab",
      `Are you sure you want to delete the slab ${slab.salaryRange} (${slab.monthlyTax}) for ${slab.state}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch(deletePtSlab(slab.id)),
        },
      ]
    );
  };

  // TDS Save
  const handleSaveTds = () => {
    if (!tdsStdNew.trim() || !tdsStdOld.trim() || !tdsDeadline.trim()) {
      Alert.alert("Validation Error", "Please fill all required TDS fields marked with *");
      return;
    }
    dispatch(
      saveTdsSettings({
        defaultTaxRegime: tdsRegime,
        effectiveFinancialYear: tdsFinancialYear,
        standardDeductionNew: tdsStdNew.trim(),
        standardDeductionOld: tdsStdOld.trim(),
        requireInvestmentDeclaration: tdsRequireDecl,
        proofSubmissionDeadline: tdsDeadline.trim(),
        updatedBy: user?.name || "Admin",
      })
    );
    Alert.alert("Success", "Tax Deducted at Source (TDS) Settings saved successfully!");
  };

  // Bonus Save
  const handleSaveBonus = () => {
    if (!bonusRate.trim() || !bonusCeiling.trim() || !bonusMinDays.trim() || !bonusEffectiveDate.trim()) {
      Alert.alert("Validation Error", "Please fill all required Statutory Bonus fields marked with *");
      return;
    }
    dispatch(
      saveBonusSettings({
        calculationMethod: bonusCalcMethod,
        bonusRate: bonusRate.trim(),
        wageCeiling: bonusCeiling.trim(),
        minServiceDays: bonusMinDays.trim(),
        disbursementSchedule: bonusDisbursement.trim(),
        effectiveDate: bonusEffectiveDate.trim(),
        updatedBy: user?.name || "RR Security Administrator",
      })
    );
    Alert.alert("Success", "Statutory Bonus Settings saved successfully!");
  };

  // Gratuity Save
  const handleSaveGratuity = () => {
    if (!gratPeriodYears.trim() || !gratMaxExempt.trim() || !gratEffectiveDate.trim()) {
      Alert.alert("Validation Error", "Please fill all required Gratuity fields marked with *");
      return;
    }
    dispatch(
      saveGratuitySettings({
        eligibilityPeriodYears: gratPeriodYears.trim(),
        calculationBasis: gratCalcBasis,
        maxTaxExemptionLimit: gratMaxExempt.trim(),
        effectiveDate: gratEffectiveDate.trim(),
        updatedBy: user?.name || "Admin",
      })
    );
    Alert.alert("Success", "Gratuity Configuration saved successfully!");
  };

  // LWF Handlers
  const handleOpenAddLwfRule = () => {
    setEditingLwfRule(null);
    setLwfFormState("Haryana");
    setLwfFormEmpShare("25");
    setLwfFormEmprShare("50");
    setLwfFormFrequency("Monthly");
    setLwfFormDeductionMonths("Every Month");
    setLwfFormEffectiveDate("2026-04-01");
    setLwfModalVisible(true);
  };

  const handleOpenEditLwfRule = (rule) => {
    setEditingLwfRule(rule);
    setLwfFormState(rule.state);
    setLwfFormEmpShare(rule.employeeShare.replace("₹", ""));
    setLwfFormEmprShare(rule.employerShare.replace("₹", ""));
    setLwfFormFrequency(rule.frequency);
    setLwfFormDeductionMonths(rule.deductionMonths);
    setLwfFormEffectiveDate(rule.effectiveDate || "2026-04-01");
    setLwfModalVisible(true);
  };

  const handleSaveLwfRule = () => {
    if (!lwfFormEmpShare.trim() || !lwfFormEmprShare.trim()) {
      Alert.alert("Validation Error", "Please provide employee and employer share amount.");
      return;
    }
    if (editingLwfRule) {
      dispatch(
        editLwfRule({
          id: editingLwfRule.id,
          state: lwfFormState,
          employeeShare: lwfFormEmpShare.trim(),
          employerShare: lwfFormEmprShare.trim(),
          frequency: lwfFormFrequency,
          deductionMonths: lwfFormDeductionMonths.trim(),
          effectiveDate: lwfFormEffectiveDate.trim(),
        })
      );
      Alert.alert("Updated", `LWF rule for ${lwfFormState} updated successfully.`);
    } else {
      dispatch(
        addLwfRule({
          state: lwfFormState,
          employeeShare: lwfFormEmpShare.trim(),
          employerShare: lwfFormEmprShare.trim(),
          frequency: lwfFormFrequency,
          deductionMonths: lwfFormDeductionMonths.trim(),
          effectiveDate: lwfFormEffectiveDate.trim(),
          status: "Active",
        })
      );
      Alert.alert("Added", `New LWF rule for ${lwfFormState} created successfully.`);
    }
    setLwfModalVisible(false);
  };

  const handleDeleteLwfRule = (rule) => {
    Alert.alert(
      "Delete LWF Rule",
      `Are you sure you want to delete the Labour Welfare Fund rule for ${rule.state}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch(deleteLwfRule(rule.id)),
        },
      ]
    );
  };

  // Filtered PT Slabs
  const filteredPtSlabs = (ptSlabs || []).filter((slab) => {
    const matchState =
      ptStateFilter === "All States" ||
      slab.state.toLowerCase() === ptStateFilter.toLowerCase();
    const query = ptSearchQuery.toLowerCase().trim();
    const matchQuery =
      !query ||
      slab.state.toLowerCase().includes(query) ||
      slab.salaryRange.toLowerCase().includes(query) ||
      slab.monthlyTax.toLowerCase().includes(query);
    return matchState && matchQuery;
  });

  // Filtered LWF Rules
  const filteredLwfRules = (lwfRules || []).filter((rule) => {
    if (lwfStateFilter === "All States") return true;
    return rule.state.toLowerCase() === lwfStateFilter.toLowerCase();
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                dispatch(toggleDrawer());
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.userAvatarCircle}>
            <Text style={styles.userAvatarInitial}>
              {(user?.name ? user.name[0] : "N").toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.userNameText}>{user?.name || "Normal User"}</Text>
            <Text style={styles.userRoleText}>
              {user?.role === "ADMIN" ? "Admin" : "User"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.drawerHamburgerBtn}
          onPress={() => dispatch(toggleDrawer())}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title & Compliance Badge */}
        <View style={styles.pageTitleCard}>
          <View style={styles.titleBadgeRow}>
            <Text style={styles.pageTitle}>Statutory Setup</Text>
            <View style={styles.complianceBadge}>
              <Text style={styles.complianceBadgeText}>
                COMPLIANCE & STATUTORY RULES
              </Text>
            </View>
          </View>
          <Text style={styles.pageSubtitle}>
            Configure statutory deductions, employee contributions, state tax slabs and compliance calculation rules.
          </Text>

          {/* Action Button: Masters Components ↗ */}
          <View style={styles.headerActionsRow}>
            <TouchableOpacity
              style={styles.mastersComponentsBtn}
              onPress={handleMastersComponents}
              activeOpacity={0.7}
            >
              <Text style={styles.mastersComponentsBtnText}>
                Masters Components
              </Text>
              <Ionicons name="open-outline" size={14} color="#334155" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sub-Tabs Horizontal Pill Scroll Bar */}
        <View style={styles.subTabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subTabsScroll}
          >
            {subTabsList.map((tab) => {
              const isActive = activeStatutorySubTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.subTabPill,
                    isActive && styles.activeSubTabPill,
                  ]}
                  onPress={() => dispatch(setActiveStatutorySubTab(tab))}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.subTabPillText,
                      isActive && styles.activeSubTabPillText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ========================================================= */}
        {/* 1. OVERVIEW COMPLIANCE SECTION                            */}
        {/* ========================================================= */}
        {activeStatutorySubTab === "Overview" && (
          <View>
            <View style={styles.complianceStatusBanner}>
              <View style={styles.statusBannerItem}>
                <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
                <Text style={styles.statusBannerText}>
                  6 Rules Configured & Active
                </Text>
              </View>
              <View style={styles.statusBannerDivider} />
              <View style={styles.statusBannerItem}>
                <Ionicons name="checkmark-done-circle" size={16} color="#2563EB" />
                <Text style={styles.statusBannerText}>
                  FY 2026-27 Compliant
                </Text>
              </View>
            </View>

            <View style={styles.overviewCardsWrap}>
              {modules.map((module) => {
                const isEnabled = module.status === "Enabled";

                return (
                  <View key={module.id} style={styles.moduleCard}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardModuleTitle}>{module.title}</Text>

                      <TouchableOpacity
                        style={[
                          styles.statusToggleBadge,
                          isEnabled
                            ? styles.statusToggleBadgeEnabled
                            : styles.statusToggleBadgeDisabled,
                        ]}
                        onPress={() => handleToggleOverviewModule(module)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={
                            isEnabled
                              ? "checkmark-circle"
                              : "close-circle"
                          }
                          size={13}
                          color={isEnabled ? "#059669" : "#64748B"}
                        />
                        <Text
                          style={[
                            styles.statusToggleText,
                            isEnabled
                              ? styles.statusToggleTextEnabled
                              : styles.statusToggleTextDisabled,
                          ]}
                        >
                          {module.status}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.cardModuleDesc}>
                      {module.description}
                    </Text>

                    <View style={styles.metricContainerBox}>
                      <Text style={styles.metricLabelText}>
                        {module.metricLabel}
                      </Text>
                      <Text style={styles.metricValueText}>
                        {module.metricValue}
                      </Text>
                    </View>

                    <View style={styles.cardFooterRow}>
                      <View style={styles.footerMetaGroup}>
                        <Text style={styles.footerMetaLabel}>
                          {module.footerMetaLabel}
                        </Text>
                        <Text style={styles.footerMetaValue}>
                          {module.footerMetaValue}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.configureBtn}
                        onPress={() => handleConfigureModule(module)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.configureBtnText}>Configure</Text>
                        <Ionicons name="arrow-forward" size={14} color="#2563EB" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* 2. PROVIDENT FUND (PF) SETTINGS                           */}
        {/* ========================================================= */}
        {activeStatutorySubTab === "PF (Provident Fund)" && (
          <View style={styles.formContainerCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionTitleText}>Provident Fund (PF) Settings</Text>
                <Text style={styles.sectionSubtitleText}>
                  Configure employee and employer EPF contribution percentages and ceiling bounds
                </Text>
              </View>

              <TouchableOpacity
                style={styles.moduleStatusBtn}
                onPress={() => dispatch(togglePfModuleStatus())}
                activeOpacity={0.8}
              >
                <Text style={styles.moduleStatusLabel}>Module Status:</Text>
                <View
                  style={[
                    styles.statusPill,
                    pfSettings?.moduleStatus === "Active"
                      ? styles.statusPillActive
                      : styles.statusPillInactive,
                  ]}
                >
                  <Ionicons
                    name={
                      pfSettings?.moduleStatus === "Active"
                        ? "toggle"
                        : "toggle-outline"
                    }
                    size={18}
                    color={
                      pfSettings?.moduleStatus === "Active" ? "#059669" : "#64748B"
                    }
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      pfSettings?.moduleStatus === "Active"
                        ? styles.statusPillTextActive
                        : styles.statusPillTextInactive,
                    ]}
                  >
                    {pfSettings?.moduleStatus || "Active"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.formDivider} />

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Employee Contribution (%) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={pfEmpContrib}
                onChangeText={setPfEmpContrib}
                keyboardType="numeric"
                placeholder="12"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Standard statutory deduction is 12% of Basic + DA
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Employer Contribution (%) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={pfEmprContrib}
                onChangeText={setPfEmprContrib}
                keyboardType="numeric"
                placeholder="12"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Split: 8.33% EPS (Pension) + 3.67% EPF
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                PF Wage Ceiling (₹) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={pfCeiling}
                onChangeText={setPfCeiling}
                keyboardType="numeric"
                placeholder="25000"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Statutory ceiling limit (Default ₹15,000)
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Effective From Date <Text style={styles.asterisk}>*</Text>
              </Text>
              <View style={styles.inputWithIconContainer}>
                <TextInput
                  style={[styles.textInputBox, styles.inputWithIconFlex]}
                  value={pfDate}
                  onChangeText={setPfDate}
                  placeholder="09/01/2026"
                  placeholderTextColor="#94A3B8"
                />
                <View style={styles.inputRightIconBox}>
                  <Ionicons name="calendar-outline" size={17} color="#64748B" />
                </View>
              </View>
              <Text style={styles.helperCaptionText}>
                Date from which this configuration takes effect
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>Voluntary Provident Fund (VPF)</Text>
              <TouchableOpacity
                style={styles.dropdownSelectorBtn}
                onPress={() => setShowVpfModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                  {pfVpf}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>Restrict PF to Wage Ceiling</Text>
              <TouchableOpacity
                style={styles.dropdownSelectorBtn}
                onPress={() => setShowRestrictModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                  {pfRestrictCeiling}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.auditBox}>
              <Text style={styles.auditText}>
                Created: {pfSettings?.createdBy || "2025-04-01 by System SuperAdmin"}
              </Text>
              <Text style={styles.auditText}>
                Last Updated: {pfSettings?.lastUpdated || "2026-10-12 by RR Security Administrator"}
              </Text>
            </View>

            <View style={styles.saveBtnWrap}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleSavePf}
                activeOpacity={0.8}
              >
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>Save PF Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* 3. EMPLOYEE STATE INSURANCE (ESI) SETTINGS                */}
        {/* ========================================================= */}
        {activeStatutorySubTab === "ESI" && (
          <View style={styles.formContainerCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionTitleText}>
                  Employee State Insurance (ESI) Settings
                </Text>
                <Text style={styles.sectionSubtitleText}>
                  Configure healthcare contribution percentages and wage eligibility thresholds
                </Text>
              </View>

              <TouchableOpacity
                style={styles.moduleStatusBtn}
                onPress={() => dispatch(toggleEsiModuleStatus())}
                activeOpacity={0.8}
              >
                <Text style={styles.moduleStatusLabel}>Module Status:</Text>
                <View
                  style={[
                    styles.statusPill,
                    esiSettings?.moduleStatus === "Active"
                      ? styles.statusPillActive
                      : styles.statusPillInactive,
                  ]}
                >
                  <Ionicons
                    name={
                      esiSettings?.moduleStatus === "Active"
                        ? "toggle"
                        : "toggle-outline"
                    }
                    size={18}
                    color={
                      esiSettings?.moduleStatus === "Active" ? "#059669" : "#64748B"
                    }
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      esiSettings?.moduleStatus === "Active"
                        ? styles.statusPillTextActive
                        : styles.statusPillTextInactive,
                    ]}
                  >
                    {esiSettings?.moduleStatus || "Active"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.formDivider} />

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Employee Contribution (%) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={esiEmpContrib}
                onChangeText={setEsiEmpContrib}
                keyboardType="numeric"
                placeholder="0.75"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Statutory rate is 0.75% of Gross Wages
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Employer Contribution (%) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={esiEmprContrib}
                onChangeText={setEsiEmprContrib}
                keyboardType="numeric"
                placeholder="3.25"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Statutory rate is 3.25% of Gross Wages
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Salary / Wage Eligibility Limit (₹) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={esiWageLimit}
                onChangeText={setEsiWageLimit}
                keyboardType="numeric"
                placeholder="21000"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Employees with gross salary up to ₹21,000 are covered
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Disability Wage Limit (₹) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={esiDisabilityLimit}
                onChangeText={setEsiDisabilityLimit}
                keyboardType="numeric"
                placeholder="25000"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Special limit for persons with disabilities (₹25,000)
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Effective From Date <Text style={styles.asterisk}>*</Text>
              </Text>
              <View style={styles.inputWithIconContainer}>
                <TextInput
                  style={[styles.textInputBox, styles.inputWithIconFlex]}
                  value={esiDate}
                  onChangeText={setEsiDate}
                  placeholder="04/01/2026"
                  placeholderTextColor="#94A3B8"
                />
                <View style={styles.inputRightIconBox}>
                  <Ionicons name="calendar-outline" size={17} color="#64748B" />
                </View>
              </View>
            </View>

            <View style={styles.esiNoteAlertBox}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color="#0284C7"
                style={{ marginTop: 1 }}
              />
              <Text style={styles.esiNoteAlertText}>
                <Text style={{ fontWeight: "700" }}>Note: </Text>
                ESI deduction is computed on gross earned wage (excluding annual bonus and overtime). If an employee's daily wage is under ₹176, employee contribution is exempted.
              </Text>
            </View>

            <View style={styles.auditBox}>
              <Text style={styles.auditText}>
                Created: {esiSettings?.createdBy || "2025-04-01 by System SuperAdmin"}
              </Text>
              <Text style={styles.auditText}>
                Last Updated: {esiSettings?.lastUpdated || "2026-04-01 by Admin"}
              </Text>
            </View>

            <View style={styles.saveBtnWrap}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleSaveEsi}
                activeOpacity={0.8}
              >
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>Save ESI Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* 4. PROFESSIONAL TAX (PT) SLABS                            */}
        {/* ========================================================= */}
        {activeStatutorySubTab === "PT (Professional Tax)" && (
          <View style={styles.formContainerCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionTitleText}>Professional Tax (PT) Slabs</Text>
                <Text style={styles.sectionSubtitleText}>
                  State-wise salary range slabs and monthly tax deduction amounts
                </Text>
              </View>

              <View style={styles.moduleStatusBtn}>
                <Text style={styles.moduleStatusLabel}>Module Status:</Text>
                <View style={[styles.statusPill, styles.statusPillActive]}>
                  <Ionicons name="toggle" size={18} color="#059669" />
                  <Text style={[styles.statusPillText, styles.statusPillTextActive]}>
                    Active
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.formDivider} />

            <View style={styles.ptActionBar}>
              <View style={styles.ptStateFilterWrapper}>
                <Text style={styles.filterByLabel}>Filter by State:</Text>
                <TouchableOpacity
                  style={styles.stateDropdownBtn}
                  onPress={() => setShowPtStateFilterModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.stateDropdownBtnText} numberOfLines={1}>
                    {ptStateFilter}
                  </Text>
                  <Ionicons name="chevron-down" size={15} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.ptSearchWrapper}>
                <Ionicons name="search" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.ptSearchInput}
                  placeholder="Search state or tax amount..."
                  placeholderTextColor="#94A3B8"
                  value={ptSearchQuery}
                  onChangeText={(val) => dispatch(setPtSearchQuery(val))}
                />
                {ptSearchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => dispatch(setPtSearchQuery(""))}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.addPtSlabBtn}
                onPress={handleOpenAddPtSlab}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addPtSlabBtnText}>Add PT Slab</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ptSlabsListContainer}>
              {filteredPtSlabs.length === 0 ? (
                <View style={styles.emptyPtBox}>
                  <Ionicons name="document-text-outline" size={36} color="#94A3B8" />
                  <Text style={styles.emptyPtText}>No PT slabs found matching your filter.</Text>
                </View>
              ) : (
                filteredPtSlabs.map((slab) => {
                  const isExempt = slab.monthlyTax.toLowerCase().includes("exempt");

                  return (
                    <View key={slab.id} style={styles.ptSlabCard}>
                      <View style={styles.ptSlabCardHeader}>
                        <View style={styles.stateNameRow}>
                          <Ionicons name="location-outline" size={16} color="#2563EB" />
                          <Text style={styles.ptSlabStateName}>{slab.state}</Text>
                        </View>

                        <View style={styles.ptStatusBadge}>
                          <Text style={styles.ptStatusBadgeText}>{slab.status}</Text>
                        </View>
                      </View>

                      <View style={styles.ptSlabDataRow}>
                        <View style={styles.ptDataItem}>
                          <Text style={styles.ptDataLabel}>SALARY RANGE (₹)</Text>
                          <Text style={styles.ptSalaryRangeVal}>{slab.salaryRange}</Text>
                        </View>

                        <View style={styles.ptDataItem}>
                          <Text style={styles.ptDataLabel}>MONTHLY TAX AMOUNT</Text>
                          <Text
                            style={[
                              styles.ptTaxAmountVal,
                              isExempt && styles.ptTaxExemptVal,
                            ]}
                          >
                            {slab.monthlyTax}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.ptSlabSubDataRow}>
                        <View style={{ flex: 1.2 }}>
                          <Text style={styles.ptSubDataLabel}>February Special Rate:</Text>
                          <Text style={styles.ptSubDataValue}>{slab.febSpecialRate}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.ptSubDataLabel}>Effective Date:</Text>
                          <Text style={styles.ptSubDataValue}>{slab.effectiveDate}</Text>
                        </View>
                      </View>

                      <View style={styles.ptCardActionsRow}>
                        <TouchableOpacity
                          style={styles.ptActionIconBtn}
                          onPress={() => handleOpenEditPtSlab(slab)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="pencil-outline" size={16} color="#475569" />
                          <Text style={styles.ptActionIconText}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.ptActionIconBtn, styles.ptDeleteBtn]}
                          onPress={() => handleDeletePtSlab(slab)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          <Text style={[styles.ptActionIconText, { color: "#EF4444" }]}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* 5. TAX DEDUCTED AT SOURCE (TDS) SETTINGS                  */}
        {/* ========================================================= */}
        {activeStatutorySubTab === "TDS" && (
          <View style={styles.formContainerCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionTitleText}>
                  Tax Deducted at Source (TDS) Settings
                </Text>
                <Text style={styles.sectionSubtitleText}>
                  Income tax withholding regimes, standard deductions, and declaration workflows
                </Text>
              </View>

              <TouchableOpacity
                style={styles.moduleStatusBtn}
                onPress={() => dispatch(toggleTdsModuleStatus())}
                activeOpacity={0.8}
              >
                <Text style={styles.moduleStatusLabel}>Module Status:</Text>
                <View
                  style={[
                    styles.statusPill,
                    tdsSettings?.moduleStatus === "Active"
                      ? styles.statusPillActive
                      : styles.statusPillInactive,
                  ]}
                >
                  <Ionicons
                    name={
                      tdsSettings?.moduleStatus === "Active"
                        ? "toggle"
                        : "toggle-outline"
                    }
                    size={18}
                    color={
                      tdsSettings?.moduleStatus === "Active" ? "#059669" : "#64748B"
                    }
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      tdsSettings?.moduleStatus === "Active"
                        ? styles.statusPillTextActive
                        : styles.statusPillTextInactive,
                    ]}
                  >
                    {tdsSettings?.moduleStatus || "Active"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.formDivider} />

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Default Tax Regime <Text style={styles.asterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelectorBtn}
                onPress={() => setShowTdsRegimeModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                  {tdsRegime}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
              <Text style={styles.helperCaptionText}>
                Employees can optionally switch regime in declarations
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Effective Financial Year <Text style={styles.asterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelectorBtn}
                onPress={() => setShowTdsFyModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                  {tdsFinancialYear}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Standard Deduction - New Regime (₹) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={tdsStdNew}
                onChangeText={setTdsStdNew}
                keyboardType="numeric"
                placeholder="75000"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Budget 2024 revised standard deduction is ₹75,000
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Standard Deduction - Old Regime (₹) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={tdsStdOld}
                onChangeText={setTdsStdOld}
                keyboardType="numeric"
                placeholder="50000"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Standard deduction under old regime is ₹50,000
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>Require Employee Investment Declaration</Text>
              <TouchableOpacity
                style={styles.dropdownSelectorBtn}
                onPress={() => setShowTdsDeclModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                  {tdsRequireDecl}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>Proof Submission Deadline</Text>
              <View style={styles.inputWithIconContainer}>
                <TextInput
                  style={[styles.textInputBox, styles.inputWithIconFlex]}
                  value={tdsDeadline}
                  onChangeText={setTdsDeadline}
                  placeholder="01/31/2027"
                  placeholderTextColor="#94A3B8"
                />
                <View style={styles.inputRightIconBox}>
                  <Ionicons name="calendar-outline" size={17} color="#64748B" />
                </View>
              </View>
            </View>

            <View style={styles.auditBox}>
              <Text style={styles.auditText}>
                Last Updated: {tdsSettings?.lastUpdated || "2026-04-01 by Admin"}
              </Text>
            </View>

            <View style={styles.saveBtnWrap}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleSaveTds}
                activeOpacity={0.8}
              >
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>Save TDS Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* 6. STATUTORY BONUS SETTINGS                               */}
        {/* ========================================================= */}
        {activeStatutorySubTab === "Bonus" && (
          <View style={styles.formContainerCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionTitleText}>Statutory Bonus Settings</Text>
                <Text style={styles.sectionSubtitleText}>
                  Payment of Bonus Act compliance rates, wage ceiling, and eligibility rules
                </Text>
              </View>

              <TouchableOpacity
                style={styles.moduleStatusBtn}
                onPress={() => dispatch(toggleBonusModuleStatus())}
                activeOpacity={0.8}
              >
                <Text style={styles.moduleStatusLabel}>Module Status:</Text>
                <View
                  style={[
                    styles.statusPill,
                    bonusSettings?.moduleStatus === "Active"
                      ? styles.statusPillActive
                      : styles.statusPillInactive,
                  ]}
                >
                  <Ionicons
                    name={
                      bonusSettings?.moduleStatus === "Active"
                        ? "toggle"
                        : "toggle-outline"
                    }
                    size={18}
                    color={
                      bonusSettings?.moduleStatus === "Active" ? "#059669" : "#64748B"
                    }
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      bonusSettings?.moduleStatus === "Active"
                        ? styles.statusPillTextActive
                        : styles.statusPillTextInactive,
                    ]}
                  >
                    {bonusSettings?.moduleStatus || "Active"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.formDivider} />

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Calculation Method <Text style={styles.asterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelectorBtn}
                onPress={() => setShowBonusCalcModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                  {bonusCalcMethod}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Statutory Bonus Rate (%) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={bonusRate}
                onChangeText={setBonusRate}
                keyboardType="numeric"
                placeholder="8.33"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Minimum statutory bonus is 8.33% (Max 20%)
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Statutory Wage Ceiling (₹) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={bonusCeiling}
                onChangeText={setBonusCeiling}
                keyboardType="numeric"
                placeholder="7000"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Wage ceiling for bonus computation (₹7,000 or Minimum Wage)
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Minimum Service Requirement (Days) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={bonusMinDays}
                onChangeText={setBonusMinDays}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Minimum 30 working days required in the accounting year
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>Disbursement Schedule</Text>
              <TextInput
                style={styles.textInputBox}
                value={bonusDisbursement}
                onChangeText={setBonusDisbursement}
                placeholder="Annual (Diwali / Puja Festival)"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Effective From Date <Text style={styles.asterisk}>*</Text>
              </Text>
              <View style={styles.inputWithIconContainer}>
                <TextInput
                  style={[styles.textInputBox, styles.inputWithIconFlex]}
                  value={bonusEffectiveDate}
                  onChangeText={setBonusEffectiveDate}
                  placeholder="04/01/2026"
                  placeholderTextColor="#94A3B8"
                />
                <View style={styles.inputRightIconBox}>
                  <Ionicons name="calendar-outline" size={17} color="#64748B" />
                </View>
              </View>
            </View>

            <View style={styles.auditBox}>
              <Text style={styles.auditText}>
                Last Updated: {bonusSettings?.lastUpdated || "2026-10-16 by RR Security Administrator"}
              </Text>
            </View>

            <View style={styles.saveBtnWrap}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleSaveBonus}
                activeOpacity={0.8}
              >
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>Save Bonus Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* 7. GRATUITY CONFIGURATION                                 */}
        {/* ========================================================= */}
        {activeStatutorySubTab === "Gratuity" && (
          <View style={styles.formContainerCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionTitleText}>Gratuity Configuration</Text>
                <Text style={styles.sectionSubtitleText}>
                  Payment of Gratuity Act retirement benefit computation basis and eligibility
                </Text>
              </View>

              <TouchableOpacity
                style={styles.moduleStatusBtn}
                onPress={() => dispatch(toggleGratuityModuleStatus())}
                activeOpacity={0.8}
              >
                <Text style={styles.moduleStatusLabel}>Module Status:</Text>
                <View
                  style={[
                    styles.statusPill,
                    gratuitySettings?.moduleStatus === "Active"
                      ? styles.statusPillActive
                      : styles.statusPillInactive,
                  ]}
                >
                  <Ionicons
                    name={
                      gratuitySettings?.moduleStatus === "Active"
                        ? "toggle"
                        : "toggle-outline"
                    }
                    size={18}
                    color={
                      gratuitySettings?.moduleStatus === "Active" ? "#059669" : "#64748B"
                    }
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      gratuitySettings?.moduleStatus === "Active"
                        ? styles.statusPillTextActive
                        : styles.statusPillTextInactive,
                    ]}
                  >
                    {gratuitySettings?.moduleStatus || "Active"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.formDivider} />

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Eligibility Period (Years) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={gratPeriodYears}
                onChangeText={setGratPeriodYears}
                keyboardType="numeric"
                placeholder="5"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Statutory requirement is 5 years of continuous service
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Calculation Basis <Text style={styles.asterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dropdownSelectorBtn}
                onPress={() => setShowGratBasisModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownSelectorText} numberOfLines={1}>
                  {gratCalcBasis}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Maximum Tax Exemption Limit (₹) <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInputBox}
                value={gratMaxExempt}
                onChangeText={setGratMaxExempt}
                keyboardType="numeric"
                placeholder="2000000"
                placeholderTextColor="#94A3B8"
              />
              <Text style={styles.helperCaptionText}>
                Maximum tax-exempt ceiling is ₹20,00,000 (20 Lakhs)
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formInputLabel}>
                Effective From Date <Text style={styles.asterisk}>*</Text>
              </Text>
              <View style={styles.inputWithIconContainer}>
                <TextInput
                  style={[styles.textInputBox, styles.inputWithIconFlex]}
                  value={gratEffectiveDate}
                  onChangeText={setGratEffectiveDate}
                  placeholder="04/01/2026"
                  placeholderTextColor="#94A3B8"
                />
                <View style={styles.inputRightIconBox}>
                  <Ionicons name="calendar-outline" size={17} color="#64748B" />
                </View>
              </View>
            </View>

            <View style={styles.formulaCardContainer}>
              <Text style={styles.formulaCardHeading}>GRATUITY FORMULA:</Text>
              <View style={styles.formulaDisplayBox}>
                <Text style={styles.formulaDisplayText}>
                  15 Days x (Last Drawn Basic + DA) x Completed Years / 26
                </Text>
              </View>
            </View>

            <View style={styles.auditBox}>
              <Text style={styles.auditText}>
                Last Updated: {gratuitySettings?.lastUpdated || "2026-04-01 by Admin"}
              </Text>
            </View>

            <View style={styles.saveBtnWrap}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleSaveGratuity}
                activeOpacity={0.8}
              >
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>Save Gratuity Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* 8. LABOUR WELFARE FUND (LWF) STATE RULES (SCREENSHOT)     */}
        {/* ========================================================= */}
        {activeStatutorySubTab === "Labour Welfare Fund(LWF)" && (
          <View style={styles.formContainerCard}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionTitleText}>
                  Labour Welfare Fund (LWF) State Rules
                </Text>
                <Text style={styles.sectionSubtitleText}>
                  Configure state-wise employee & employer contributions and deduction frequencies
                </Text>
              </View>

              <TouchableOpacity
                style={styles.moduleStatusBtn}
                onPress={() => dispatch(toggleLwfModuleStatus())}
                activeOpacity={0.8}
              >
                <Text style={styles.moduleStatusLabel}>Module Status:</Text>
                <View
                  style={[
                    styles.statusPill,
                    lwfModuleStatus === "Active"
                      ? styles.statusPillActive
                      : styles.statusPillInactive,
                  ]}
                >
                  <Ionicons
                    name={lwfModuleStatus === "Active" ? "toggle" : "toggle-outline"}
                    size={18}
                    color={lwfModuleStatus === "Active" ? "#059669" : "#64748B"}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      lwfModuleStatus === "Active"
                        ? styles.statusPillTextActive
                        : styles.statusPillTextInactive,
                    ]}
                  >
                    {lwfModuleStatus}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.formDivider} />

            {/* Filter State & Add Button Row */}
            <View style={styles.lwfActionBar}>
              <View style={styles.ptStateFilterWrapper}>
                <Text style={styles.filterByLabel}>Filter State:</Text>
                <TouchableOpacity
                  style={styles.stateDropdownBtn}
                  onPress={() => setShowLwfStateFilterModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.stateDropdownBtnText} numberOfLines={1}>
                    {lwfStateFilter}
                  </Text>
                  <Ionicons name="chevron-down" size={15} color="#64748B" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.addPtSlabBtn}
                onPress={handleOpenAddLwfRule}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addPtSlabBtnText}>Add State LWF Rule</Text>
              </TouchableOpacity>
            </View>

            {/* LWF Rules Cards */}
            <View style={styles.ptSlabsListContainer}>
              {filteredLwfRules.length === 0 ? (
                <View style={styles.emptyPtBox}>
                  <Ionicons name="shield-outline" size={36} color="#94A3B8" />
                  <Text style={styles.emptyPtText}>No LWF rules found for {lwfStateFilter}.</Text>
                </View>
              ) : (
                filteredLwfRules.map((rule) => {
                  return (
                    <View key={rule.id} style={styles.ptSlabCard}>
                      <View style={styles.ptSlabCardHeader}>
                        <View style={styles.stateNameRow}>
                          <Ionicons name="location-outline" size={16} color="#2563EB" />
                          <Text style={styles.ptSlabStateName}>{rule.state}</Text>
                        </View>

                        <View style={styles.ptStatusBadge}>
                          <Text style={styles.ptStatusBadgeText}>{rule.status}</Text>
                        </View>
                      </View>

                      {/* Share Row */}
                      <View style={styles.ptSlabDataRow}>
                        <View style={styles.ptDataItem}>
                          <Text style={styles.ptDataLabel}>EMPLOYEE SHARE</Text>
                          <Text style={styles.ptSalaryRangeVal}>{rule.employeeShare}</Text>
                        </View>

                        <View style={styles.ptDataItem}>
                          <Text style={styles.ptDataLabel}>EMPLOYER SHARE</Text>
                          <Text style={styles.ptTaxAmountVal}>{rule.employerShare}</Text>
                        </View>
                      </View>

                      {/* Frequency & Deduction Month(s) */}
                      <View style={styles.lwfMetaRow}>
                        <View style={styles.lwfMetaItem}>
                          <Text style={styles.ptSubDataLabel}>FREQUENCY:</Text>
                          <View style={styles.freqBadgePill}>
                            <Text style={styles.freqBadgeText}>{rule.frequency}</Text>
                          </View>
                        </View>

                        <View style={styles.lwfMetaItem}>
                          <Text style={styles.ptSubDataLabel}>DEDUCTION MONTH(S):</Text>
                          <Text style={styles.ptSubDataValue}>{rule.deductionMonths}</Text>
                        </View>
                      </View>

                      <View style={styles.ptSlabSubDataRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.ptSubDataLabel}>Effective Date:</Text>
                          <Text style={styles.ptSubDataValue}>{rule.effectiveDate}</Text>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.ptCardActionsRow}>
                        <TouchableOpacity
                          style={styles.ptActionIconBtn}
                          onPress={() => handleOpenEditLwfRule(rule)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="pencil-outline" size={16} color="#475569" />
                          <Text style={styles.ptActionIconText}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.ptActionIconBtn, styles.ptDeleteBtn]}
                          onPress={() => handleDeleteLwfRule(rule)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          <Text style={[styles.ptActionIconText, { color: "#EF4444" }]}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ========================================================= */}
      {/* MODALS SECTION                                            */}
      {/* ========================================================= */}

      {/* MODAL: VPF DROPDOWN */}
      <Modal
        visible={showVpfModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVpfModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowVpfModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>Voluntary Provident Fund (VPF)</Text>
            {[
              "Allowed (Employees can contribute beyond 12%)",
              "Disallowed (Strict statutory 12% cap)",
              "Allowed with max 20% limit",
            ].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerOptionBtn,
                  pfVpf === option && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setPfVpf(option);
                  setShowVpfModal(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    pfVpf === option && styles.pickerOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {pfVpf === option && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: RESTRICT PF CEILING */}
      <Modal
        visible={showRestrictModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRestrictModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRestrictModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>Restrict PF to Wage Ceiling</Text>
            {[
              "Yes (Calculate maximum on ₹15,000)",
              "Yes (Calculate maximum on ₹25,000)",
              "No (Calculate on actual Basic + DA)",
            ].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerOptionBtn,
                  pfRestrictCeiling === option && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setPfRestrictCeiling(option);
                  setShowRestrictModal(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    pfRestrictCeiling === option && styles.pickerOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {pfRestrictCeiling === option && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: PT STATE FILTER */}
      <Modal
        visible={showPtStateFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPtStateFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPtStateFilterModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>Filter by State</Text>
            {stateOptions.map((st) => (
              <TouchableOpacity
                key={st}
                style={[
                  styles.pickerOptionBtn,
                  ptStateFilter === st && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  dispatch(setPtStateFilter(st));
                  setShowPtStateFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    ptStateFilter === st && styles.pickerOptionTextSelected,
                  ]}
                >
                  {st}
                </Text>
                {ptStateFilter === st && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: ADD / EDIT PT SLAB */}
      <Modal
        visible={ptModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPtModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.configModalCard}>
            <View style={styles.configModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.configModalTitle}>
                  {editingPtSlab ? "Edit PT Slab" : "Add New PT Slab"}
                </Text>
                <Text style={styles.configModalSub}>
                  Professional Tax monthly slab configuration
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPtModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>State *</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={ptFormState}
                  onChangeText={setPtFormState}
                  placeholder="e.g. Maharashtra, Karnataka"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Salary Range (₹) *</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={ptFormSalaryRange}
                  onChangeText={setPtFormSalaryRange}
                  placeholder="e.g. ₹10,001 - Above"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Monthly Tax Amount *</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={ptFormMonthlyTax}
                  onChangeText={setPtFormMonthlyTax}
                  placeholder="e.g. ₹200 / month or Exempt (₹0)"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>February Special Rate</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={ptFormFebSpecialRate}
                  onChangeText={setPtFormFebSpecialRate}
                  placeholder="e.g. ₹300 (Feb) or Same as Regular"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Effective Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={ptFormEffectiveDate}
                  onChangeText={setPtFormEffectiveDate}
                  placeholder="2026-04-01"
                />
              </View>

              <View style={styles.formActionsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setPtModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSavePtSlab}>
                  <Text style={styles.saveBtnText}>
                    {editingPtSlab ? "Update Slab" : "Create Slab"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: TDS REGIME DROPDOWN */}
      <Modal
        visible={showTdsRegimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTdsRegimeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTdsRegimeModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>Default Tax Regime</Text>
            {[
              "New Tax Regime (Section 115BAC - Default)",
              "Old Tax Regime (With itemized exemptions & deductions)",
            ].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerOptionBtn,
                  tdsRegime === option && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setTdsRegime(option);
                  setShowTdsRegimeModal(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    tdsRegime === option && styles.pickerOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {tdsRegime === option && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: TDS FINANCIAL YEAR */}
      <Modal
        visible={showTdsFyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTdsFyModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTdsFyModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>Effective Financial Year</Text>
            {[
              "FY 2026-2027 (AY 2027-2028)",
              "FY 2025-2026 (AY 2026-2027)",
              "FY 2027-2028 (AY 2028-2029)",
            ].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerOptionBtn,
                  tdsFinancialYear === option && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setTdsFinancialYear(option);
                  setShowTdsFyModal(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    tdsFinancialYear === option && styles.pickerOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {tdsFinancialYear === option && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: TDS INVESTMENT DECLARATION */}
      <Modal
        visible={showTdsDeclModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTdsDeclModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTdsDeclModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>
              Require Employee Investment Declaration
            </Text>
            {[
              "Yes (Enable 80C, 80D, HRA proof submissions)",
              "No (Direct withholding without itemized proof)",
            ].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerOptionBtn,
                  tdsRequireDecl === option && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setTdsRequireDecl(option);
                  setShowTdsDeclModal(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    tdsRequireDecl === option && styles.pickerOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {tdsRequireDecl === option && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: BONUS CALCULATION METHOD */}
      <Modal
        visible={showBonusCalcModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBonusCalcModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBonusCalcModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>Calculation Method</Text>
            {[
              "Percentage of Basic Salary",
              "Percentage of Basic + Dearness Allowance (DA)",
              "Fixed Statutory Rate",
            ].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerOptionBtn,
                  bonusCalcMethod === option && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setBonusCalcMethod(option);
                  setShowBonusCalcModal(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    bonusCalcMethod === option && styles.pickerOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {bonusCalcMethod === option && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: GRATUITY CALCULATION BASIS */}
      <Modal
        visible={showGratBasisModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGratBasisModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGratBasisModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>Calculation Basis</Text>
            {[
              "Basic Salary + Dearness Allowance (DA)",
              "Last Drawn Basic Salary Only",
              "Gross Wages (excluding incentive allowances)",
            ].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.pickerOptionBtn,
                  gratCalcBasis === option && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setGratCalcBasis(option);
                  setShowGratBasisModal(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    gratCalcBasis === option && styles.pickerOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {gratCalcBasis === option && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: LWF STATE FILTER */}
      <Modal
        visible={showLwfStateFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLwfStateFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLwfStateFilterModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>Filter State</Text>
            {stateOptions.map((st) => (
              <TouchableOpacity
                key={st}
                style={[
                  styles.pickerOptionBtn,
                  lwfStateFilter === st && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  dispatch(setLwfStateFilter(st));
                  setShowLwfStateFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    lwfStateFilter === st && styles.pickerOptionTextSelected,
                  ]}
                >
                  {st}
                </Text>
                {lwfStateFilter === st && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: LWF FREQUENCY SELECTOR */}
      <Modal
        visible={showLwfFreqModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLwfFreqModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLwfFreqModal(false)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>Deduction Frequency</Text>
            {[
              { freq: "Monthly", months: "Every Month" },
              { freq: "Half-Yearly", months: "June & December" },
              { freq: "Annual", months: "December Only" },
            ].map((item) => (
              <TouchableOpacity
                key={item.freq}
                style={[
                  styles.pickerOptionBtn,
                  lwfFormFrequency === item.freq && styles.pickerOptionSelected,
                ]}
                onPress={() => {
                  setLwfFormFrequency(item.freq);
                  setLwfFormDeductionMonths(item.months);
                  setShowLwfFreqModal(false);
                }}
              >
                <View>
                  <Text
                    style={[
                      styles.pickerOptionText,
                      lwfFormFrequency === item.freq && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {item.freq}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                    {item.months}
                  </Text>
                </View>
                {lwfFormFrequency === item.freq && (
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: ADD / EDIT LWF RULE */}
      <Modal
        visible={lwfModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLwfModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.configModalCard}>
            <View style={styles.configModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.configModalTitle}>
                  {editingLwfRule ? "Edit State LWF Rule" : "Add State LWF Rule"}
                </Text>
                <Text style={styles.configModalSub}>
                  Labour Welfare Fund state parameters
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setLwfModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>State *</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={lwfFormState}
                  onChangeText={setLwfFormState}
                  placeholder="e.g. Haryana, West Bengal"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Employee Share (₹) *</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={lwfFormEmpShare}
                  onChangeText={setLwfFormEmpShare}
                  keyboardType="numeric"
                  placeholder="e.g. 25"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Employer Share (₹) *</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={lwfFormEmprShare}
                  onChangeText={setLwfFormEmprShare}
                  keyboardType="numeric"
                  placeholder="e.g. 50"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Frequency *</Text>
                <TouchableOpacity
                  style={styles.dropdownSelectorBtn}
                  onPress={() => setShowLwfFreqModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownSelectorText}>
                    {lwfFormFrequency} ({lwfFormDeductionMonths})
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Deduction Month(s)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={lwfFormDeductionMonths}
                  onChangeText={setLwfFormDeductionMonths}
                  placeholder="e.g. Every Month, June & December"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Effective Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={lwfFormEffectiveDate}
                  onChangeText={setLwfFormEffectiveDate}
                  placeholder="2026-04-01"
                />
              </View>

              <View style={styles.formActionsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setLwfModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveLwfRule}>
                  <Text style={styles.saveBtnText}>
                    {editingLwfRule ? "Update Rule" : "Create Rule"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// -------------------------------------------------------------
// STYLESHEET
// -------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 12 : 8,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  topHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarInitial: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
  },
  userNameText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  userRoleText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  drawerHamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },

  // Page Title Card
  pageTitleCard: {
    marginBottom: 12,
  },
  titleBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  complianceBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#86EFAC",
  },
  complianceBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#166534",
    letterSpacing: 0.5,
  },
  pageSubtitle: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 6,
    lineHeight: 18,
  },
  headerActionsRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  mastersComponentsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mastersComponentsBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },

  // Sub Tabs
  subTabsContainer: {
    marginBottom: 14,
  },
  subTabsScroll: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  subTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeSubTabPill: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  subTabPillText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#64748B",
  },
  activeSubTabPillText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // Status Banner
  complianceStatusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  statusBannerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusBannerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  statusBannerDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#E2E8F0",
  },

  // Overview Cards
  overviewCardsWrap: {
    gap: 12,
  },
  moduleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardModuleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  statusToggleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusToggleBadgeEnabled: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  statusToggleBadgeDisabled: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusToggleTextEnabled: {
    color: "#059669",
  },
  statusToggleTextDisabled: {
    color: "#64748B",
  },
  cardModuleDesc: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    marginBottom: 10,
  },
  metricContainerBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 10,
  },
  metricLabelText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metricValueText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 2,
  },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 8,
  },
  footerMetaGroup: {
    flexDirection: "column",
  },
  footerMetaLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  footerMetaValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  configureBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  configureBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },

  // =============================================================
  // FORM CONTAINER CARDS (PF, ESI, TDS, BONUS, GRATUITY, LWF)
  // =============================================================
  formContainerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 10,
  },
  sectionTitleCol: {
    flex: 1,
    minWidth: 200,
  },
  sectionTitleText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  sectionSubtitleText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 17,
  },
  moduleStatusBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  moduleStatusLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  statusPillActive: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#86EFAC",
  },
  statusPillInactive: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusPillTextActive: {
    color: "#166534",
  },
  statusPillTextInactive: {
    color: "#64748B",
  },
  formDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },

  // Form Fields
  formGroup: {
    marginBottom: 14,
  },
  formInputLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
  },
  asterisk: {
    color: "#EF4444",
  },
  textInputBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },
  helperCaptionText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 4,
  },
  inputWithIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  inputWithIconFlex: {
    flex: 1,
    paddingRight: 40,
  },
  inputRightIconBox: {
    position: "absolute",
    right: 12,
  },
  dropdownSelectorBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dropdownSelectorText: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
  },

  // ESI Note Alert Box
  esiNoteAlertBox: {
    flexDirection: "row",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginVertical: 12,
  },
  esiNoteAlertText: {
    flex: 1,
    fontSize: 12,
    color: "#0369A1",
    lineHeight: 18,
  },

  // Gratuity Formula Box
  formulaCardContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  formulaCardHeading: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  formulaDisplayBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  formulaDisplayText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#0F172A",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  // Audit Box
  auditBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginTop: 10,
    marginBottom: 16,
    gap: 4,
  },
  auditText: {
    fontSize: 11,
    color: "#64748B",
  },

  // Save Buttons
  saveBtnWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  primaryActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryActionBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // =============================================================
  // PT & LWF SPECIFIC STYLES
  // =============================================================
  ptActionBar: {
    gap: 10,
    marginBottom: 14,
  },
  lwfActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  ptStateFilterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterByLabel: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#475569",
  },
  stateDropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  stateDropdownBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  ptSearchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  ptSearchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    paddingVertical: 0,
  },
  addPtSlabBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignSelf: "flex-end",
  },
  addPtSlabBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  ptSlabsListContainer: {
    gap: 12,
  },
  emptyPtBox: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyPtText: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 8,
    textAlign: "center",
  },
  ptSlabCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
  },
  ptSlabCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stateNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ptSlabStateName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  ptStatusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ptStatusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#166534",
  },
  ptSlabDataRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
    marginBottom: 8,
  },
  ptDataItem: {
    flex: 1,
  },
  ptDataLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
  ptSalaryRangeVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 2,
  },
  ptTaxAmountVal: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
    marginTop: 2,
  },
  ptTaxExemptVal: {
    color: "#059669",
  },
  ptSlabSubDataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  ptSubDataLabel: {
    fontSize: 10.5,
    color: "#64748B",
  },
  ptSubDataValue: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#1E293B",
  },
  lwfMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
    gap: 8,
  },
  lwfMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  freqBadgePill: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  freqBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  ptCardActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
  },
  ptActionIconBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  ptDeleteBtn: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  ptActionIconText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#475569",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  pickerModalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  pickerModalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  pickerOptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 8,
  },
  pickerOptionSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  pickerOptionText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
    flex: 1,
  },
  pickerOptionTextSelected: {
    color: "#2563EB",
    fontWeight: "700",
  },
  configModalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    maxHeight: "85%",
    overflow: "hidden",
  },
  configModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  configModalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  configModalSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  formField: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 5,
  },
  fieldInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#0F172A",
  },
  formActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  saveBtn: {
    flex: 2,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
