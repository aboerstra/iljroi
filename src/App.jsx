import { useState, useEffect, useRef } from 'react'
import './App.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Slider } from './components/ui/slider'
import { Separator } from './components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'
import { Calculator, DollarSign, Clock, TrendingUp, AlertTriangle, HelpCircle, Download, RotateCcw, Save, FileText, FileSpreadsheet, CheckCircle, Copy, ChevronDown } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import { createPortal } from 'react'
import asterixLogo from './assets/Asterix-logo-Full-Color-1024x387.png'

// Import logos
import fayeLogo from './assets/faye-logo.png'
import ijlLogo from './assets/ijl-logo.png'

function App() {
  // Current Business Metrics
  const [clientsPerYear, setClientsPerYear] = useState(2000)
  const [onboardingTimePre, setOnboardingTimePre] = useState(3.0)
  const [onboardingTimePost, setOnboardingTimePost] = useState(1.5)
  const [staffHourlyRate, setStaffHourlyRate] = useState(50)
  const [duplicateRate, setDuplicateRate] = useState(5)
  const [resolutionTime, setResolutionTime] = useState(1.5)
  const [canopyCost, setCanopyCost] = useState(10000)
  const [dropboxCost, setDropboxCost] = useState(3000)
  const [esignCost, setEsignCost] = useState(3000)
  const [capacityIncrease, setCapacityIncrease] = useState(20)
  const [revenuePerClient, setRevenuePerClient] = useState(2000)
  const [docHandlingHours, setDocHandlingHours] = useState(300)
  const [docAdminRate, setDocAdminRate] = useState(40)
  const [docRiskBuffer, setDocRiskBuffer] = useState(5000)

  // Cost Parameters
  const [crmImplementationCost, setCrmImplementationCost] = useState(150000)
  const [annualCrmLicense, setAnnualCrmLicense] = useState(60000)
  const [devHourlyRate, setDevHourlyRate] = useState(75)
  const [salesHourlyRate, setSalesHourlyRate] = useState(35)
  const [matchmakerHourlyRate, setMatchmakerHourlyRate] = useState(40)
  const [adminHourlyRate, setAdminHourlyRate] = useState(25)
  const [trainingCostDay, setTrainingCostDay] = useState(500)

  // Target Improvements
  const [targetConversionRate, setTargetConversionRate] = useState(25)
  const [targetResponseTime, setTargetResponseTime] = useState(4)
  const [targetDevHoursWeek, setTargetDevHoursWeek] = useState(4)
  const [targetTrainingDays, setTargetTrainingDays] = useState(35)

  // Current Metrics
  const [currentRetentionRate, setCurrentRetentionRate] = useState(85)
  const [currentUpsellingRate, setCurrentUpsellingRate] = useState(5)
  const [currentAdminEfficiency, setCurrentAdminEfficiency] = useState(70)
  const [currentErrorRate, setCurrentErrorRate] = useState(3)
  const [currentSalesProductivity, setCurrentSalesProductivity] = useState(75)
  const [currentMatchmakerProductivity, setCurrentMatchmakerProductivity] = useState(70)

  // Additional Business Metrics
  const [retentionImprovement, setRetentionImprovement] = useState(2)
  const [upsellingRate, setUpsellingRate] = useState(8)
  const [adminEfficiencyRate, setAdminEfficiencyRate] = useState(3.3)
  const [errorReductionRate, setErrorReductionRate] = useState(1)
  const [salesProductivityRate, setSalesProductivityRate] = useState(15)
  const [matchmakerProductivityRate, setMatchmakerProductivityRate] = useState(12)

  // Forecasted Improvements
  const [onboardingTimeReduction, setOnboardingTimeReduction] = useState(40) // % reduction
  const [duplicateRateReduction, setDuplicateRateReduction] = useState(50) // % reduction
  const [resolutionTimeReduction, setResolutionTimeReduction] = useState(40) // % reduction
  const [canopyCostReduction, setCanopyCostReduction] = useState(70) // % reduction
  const [dropboxCostReduction, setDropboxCostReduction] = useState(90) // % reduction (mostly eliminated)
  const [esignCostReduction, setEsignCostReduction] = useState(90) // % reduction (mostly eliminated)
  const [docHandlingHoursReduction, setDocHandlingHoursReduction] = useState(30) // % reduction
  const [docRiskBufferReduction, setDocRiskBufferReduction] = useState(40) // % reduction

  // Build vs Buy Comparison
  const [implementationType, setImplementationType] = useState('sugarcrm')
  const [implementationTimeline, setImplementationTimeline] = useState(3)

  // Add state for hover on action buttons
  const [hoveredAction, setHoveredAction] = useState(null);

  // Saved scenarios by name
  const [savedScenarios, setSavedScenarios] = useState({})
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showLoadMenu, setShowLoadMenu] = useState(false);

  // Preset scenario values for Asterix
  const scenarioPresets = {
    Conservative: {
      clientsPerYear: 1500,
      onboardingTimePre: 3.5,
      onboardingTimePost: 2.0,
      staffHourlyRate: 40,
      duplicateRate: 7,
      resolutionTime: 2.0,
      canopyCost: 12000,
      dropboxCost: 4000,
      esignCost: 3500,
      capacityIncrease: 10,
      revenuePerClient: 1500,
      docHandlingHours: 400,
      docAdminRate: 35,
      docRiskBuffer: 8000,
      // More conservative improvement percentages
      onboardingTimeReduction: 30,
      duplicateRateReduction: 40,
      resolutionTimeReduction: 30,
      canopyCostReduction: 60,
      dropboxCostReduction: 80,
      esignCostReduction: 80,
      docHandlingHoursReduction: 20,
      docRiskBufferReduction: 30
    },
    Moderate: {
      clientsPerYear: 2000,
      onboardingTimePre: 3.0,
      onboardingTimePost: 1.5,
      staffHourlyRate: 50,
      duplicateRate: 5,
      resolutionTime: 1.5,
      canopyCost: 10000,
      dropboxCost: 3000,
      esignCost: 3000,
      capacityIncrease: 20,
      revenuePerClient: 2000,
      docHandlingHours: 300,
      docAdminRate: 40,
      docRiskBuffer: 5000,
      // Moderate improvement percentages
      onboardingTimeReduction: 40,
      duplicateRateReduction: 50,
      resolutionTimeReduction: 40,
      canopyCostReduction: 70,
      dropboxCostReduction: 90,
      esignCostReduction: 90,
      docHandlingHoursReduction: 30,
      docRiskBufferReduction: 40
    },
    Aggressive: {
      clientsPerYear: 3000,
      onboardingTimePre: 2.5,
      onboardingTimePost: 0.75,
      staffHourlyRate: 60,
      duplicateRate: 3,
      resolutionTime: 1.0,
      canopyCost: 8000,
      dropboxCost: 2000,
      esignCost: 2000,
      capacityIncrease: 30,
      revenuePerClient: 2500,
      docHandlingHours: 200,
      docAdminRate: 50,
      docRiskBuffer: 2000,
      // Aggressive improvement percentages
      onboardingTimeReduction: 50,
      duplicateRateReduction: 60,
      resolutionTimeReduction: 50,
      canopyCostReduction: 80,
      dropboxCostReduction: 95,
      esignCostReduction: 95,
      docHandlingHoursReduction: 40,
      docRiskBufferReduction: 50
    }
  };

  const applyScenarioPreset = (preset) => {
    const values = scenarioPresets[preset];
    setClientsPerYear(values.clientsPerYear);
    setOnboardingTimePre(values.onboardingTimePre);
    setOnboardingTimePost(values.onboardingTimePost);
    setStaffHourlyRate(values.staffHourlyRate);
    setDuplicateRate(values.duplicateRate);
    setResolutionTime(values.resolutionTime);
    setCanopyCost(values.canopyCost);
    setDropboxCost(values.dropboxCost);
    setEsignCost(values.esignCost);
    setCapacityIncrease(values.capacityIncrease);
    setRevenuePerClient(values.revenuePerClient);
    setDocHandlingHours(values.docHandlingHours);
    setDocAdminRate(values.docAdminRate);
    setDocRiskBuffer(values.docRiskBuffer);
    // Apply improvement percentages
    setOnboardingTimeReduction(values.onboardingTimeReduction || 40);
    setDuplicateRateReduction(values.duplicateRateReduction || 50);
    setResolutionTimeReduction(values.resolutionTimeReduction || 40);
    setCanopyCostReduction(values.canopyCostReduction || 70);
    setDropboxCostReduction(values.dropboxCostReduction || 90);
    setEsignCostReduction(values.esignCostReduction || 90);
    setDocHandlingHoursReduction(values.docHandlingHoursReduction || 30);
    setDocRiskBufferReduction(values.docRiskBufferReduction || 40);
  };

  // Helper function to format currency without cents
  const formatCurrency = (amount) => {
    return Math.round(amount).toLocaleString()
  }

  // Reset all improvement metrics to baseline (no impact)
  const resetToBaseline = () => {
    // Reset all improvement rates to 0
    setRetentionImprovement(0)
    setUpsellingRate(0)
    setAdminEfficiencyRate(0)
    setErrorReductionRate(0)
    setSalesProductivityRate(0)
    setMatchmakerProductivityRate(0)
  }

  // Save scenario with a custom name
  const saveCurrentScenario = (name) => {
    if (!name) return;
    const currentState = {
      // Business Metrics
      clientsPerYear, onboardingTimePre, onboardingTimePost, staffHourlyRate,
      duplicateRate, resolutionTime, canopyCost, dropboxCost, esignCost,
      capacityIncrease, revenuePerClient, docHandlingHours, docAdminRate, docRiskBuffer,
      // Cost Parameters
      crmImplementationCost, annualCrmLicense, devHourlyRate, salesHourlyRate,
      matchmakerHourlyRate, adminHourlyRate, trainingCostDay,
      // Target Improvements
      targetConversionRate, targetResponseTime, targetDevHoursWeek, targetTrainingDays,
      // Current Metrics
      currentRetentionRate, currentUpsellingRate, currentAdminEfficiency,
      currentErrorRate, currentSalesProductivity, currentMatchmakerProductivity,
      // Additional Business Metrics
      retentionImprovement, upsellingRate, adminEfficiencyRate, errorReductionRate,
      salesProductivityRate, matchmakerProductivityRate,
      // Forecasted Improvements
      onboardingTimeReduction, duplicateRateReduction, resolutionTimeReduction,
      canopyCostReduction, dropboxCostReduction, esignCostReduction,
      docHandlingHoursReduction, docRiskBufferReduction,
      // Implementation
      implementationType, implementationTimeline,
      savedAt: new Date().toLocaleDateString()
    };
    setSavedScenarios(prev => ({
      ...prev,
      [name]: currentState
    }));
  };

  // Load scenario by name
  const loadSavedScenario = (name) => {
    if (savedScenarios[name]) {
      const saved = savedScenarios[name];
      // Business Metrics
      setClientsPerYear(saved.clientsPerYear || 2000);
      setOnboardingTimePre(saved.onboardingTimePre || 3.0);
      setOnboardingTimePost(saved.onboardingTimePost || 1.5);
      setStaffHourlyRate(saved.staffHourlyRate || 50);
      setDuplicateRate(saved.duplicateRate || 5);
      setResolutionTime(saved.resolutionTime || 1.5);
      setCanopyCost(saved.canopyCost || 10000);
      setDropboxCost(saved.dropboxCost || 3000);
      setEsignCost(saved.esignCost || 3000);
      setCapacityIncrease(saved.capacityIncrease || 20);
      setRevenuePerClient(saved.revenuePerClient || 1500);
      setDocHandlingHours(saved.docHandlingHours || 300);
      setDocAdminRate(saved.docAdminRate || 40);
      setDocRiskBuffer(saved.docRiskBuffer || 5000);
      // Cost Parameters
      setCrmImplementationCost(saved.crmImplementationCost || 150000);
      setAnnualCrmLicense(saved.annualCrmLicense || 60000);
      setDevHourlyRate(saved.devHourlyRate || 75);
      setSalesHourlyRate(saved.salesHourlyRate || 35);
      setMatchmakerHourlyRate(saved.matchmakerHourlyRate || 40);
      setAdminHourlyRate(saved.adminHourlyRate || 25);
      setTrainingCostDay(saved.trainingCostDay || 500);
      // Target Improvements
      setTargetConversionRate(saved.targetConversionRate || 25);
      setTargetResponseTime(saved.targetResponseTime || 4);
      setTargetDevHoursWeek(saved.targetDevHoursWeek || 4);
      setTargetTrainingDays(saved.targetTrainingDays || 35);
      // Current Metrics
      setCurrentRetentionRate(saved.currentRetentionRate || 85);
      setCurrentUpsellingRate(saved.currentUpsellingRate || 5);
      setCurrentAdminEfficiency(saved.currentAdminEfficiency || 70);
      setCurrentErrorRate(saved.currentErrorRate || 3);
      setCurrentSalesProductivity(saved.currentSalesProductivity || 75);
      setCurrentMatchmakerProductivity(saved.currentMatchmakerProductivity || 70);
      // Additional Business Metrics
      setRetentionImprovement(saved.retentionImprovement || 2);
      setUpsellingRate(saved.upsellingRate || 8);
      setAdminEfficiencyRate(saved.adminEfficiencyRate || 3.3);
      setErrorReductionRate(saved.errorReductionRate || 1);
      setSalesProductivityRate(saved.salesProductivityRate || 15);
      setMatchmakerProductivityRate(saved.matchmakerProductivityRate || 12);
      // Forecasted Improvements
      setOnboardingTimeReduction(saved.onboardingTimeReduction || 50);
      setDuplicateRateReduction(saved.duplicateRateReduction || 60);
      setResolutionTimeReduction(saved.resolutionTimeReduction || 50);
      setCanopyCostReduction(saved.canopyCostReduction || 80);
      setDropboxCostReduction(saved.dropboxCostReduction || 100);
      setEsignCostReduction(saved.esignCostReduction || 100);
      setDocHandlingHoursReduction(saved.docHandlingHoursReduction || 40);
      setDocRiskBufferReduction(saved.docRiskBufferReduction || 50);
      // Implementation
      setImplementationType(saved.implementationType || 'sugarcrm');
      setImplementationTimeline(saved.implementationTimeline || 3);
    }
  };

  // Delete scenario by name
  const deleteScenario = (name) => {
    setSavedScenarios(prev => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const exportToPDF = async () => {
    const element = document.getElementById('calculator-content')
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF()
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    pdf.save(`CRM-ROI-Calculator-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const exportToExcel = () => {
    const results = calculateResults()
    const data = [
      ['Asterix Global ROI Calculator Results', ''],
      ['Scenario', 'Custom'],
      ['Generated', new Date().toLocaleDateString()],
      ['', ''],
      ['Summary', ''],
              ['Labor Efficiency', `$${formatCurrency(results.laborEfficiency)}`],
        ['Error Reduction', `$${formatCurrency(results.errorReduction)}`],
        ['Software Consolidation', `$${formatCurrency(results.softwareConsolidation)}`],
        ['Document Handling & Risk Avoidance', `$${formatCurrency(results.docHandlingBenefit)}`],
        ['Total Annual Savings', `$${formatCurrency(results.totalAnnualSavings)}`],
        ['Revenue Enablement', `$${formatCurrency(results.revenueEnablement)}`],
        ['Total Annual Benefits', `$${formatCurrency(results.totalAnnualBenefits)}`],
        ['Total Annual Costs', `$${formatCurrency(results.totalAnnualCosts)}`],
        ['Payback Period', `${results.paybackPeriod.toFixed(1)} months`],
        ['ROI', `${results.roi.toFixed(1)}%`],
        ['3-Year NPV', `$${formatCurrency(results.threeYearNPV)}`],
      ['', ''],
      ['Strategic & Qualitative Benefits', ''],
      ['- Enhanced client satisfaction and retention', ''],
      ['- Shorter sales/onboarding cycles', ''],
      ['- Improved audit/compliance posture', ''],
      ['- Increased staff retention due to less burnout', ''],
      ['- Brand elevation via digital maturity', '']
    ]
    
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'ROI Analysis')
    XLSX.writeFile(wb, `Asterix-ROI-Calculator-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const calculateResults = () => {
    // Calculate forecasted values based on improvement percentages
    const forecastedOnboardingTime = onboardingTimePre * (1 - onboardingTimeReduction / 100);
    const forecastedDuplicateRate = duplicateRate * (1 - duplicateRateReduction / 100);
    const forecastedResolutionTime = resolutionTime * (1 - resolutionTimeReduction / 100);
    const forecastedCanopyCost = canopyCost * (1 - canopyCostReduction / 100);
    const forecastedDropboxCost = dropboxCost * (1 - dropboxCostReduction / 100);
    const forecastedEsignCost = esignCost * (1 - esignCostReduction / 100);
    const forecastedDocHandlingHours = docHandlingHours * (1 - docHandlingHoursReduction / 100);
    const forecastedDocRiskBuffer = docRiskBuffer * (1 - docRiskBufferReduction / 100);
    
    // Labor Efficiency - Time savings from faster onboarding
    // Calculate hours saved per client, then multiply by hourly rate and number of clients
    const laborEfficiency = (onboardingTimePre - forecastedOnboardingTime) * staffHourlyRate * clientsPerYear;
    
    // Error Reduction - Cost savings from fewer duplicate/rework issues
    // Calculate the cost of handling duplicates before vs after improvements
    const currentDuplicateCost = (clientsPerYear * (duplicateRate / 100)) * resolutionTime * staffHourlyRate;
    const forecastedDuplicateCost = (clientsPerYear * (forecastedDuplicateRate / 100)) * forecastedResolutionTime * staffHourlyRate;
    const errorReduction = currentDuplicateCost - forecastedDuplicateCost;
    
    // Software Consolidation - Direct cost savings from replacing multiple tools
    const softwareConsolidation = (canopyCost - forecastedCanopyCost) + (dropboxCost - forecastedDropboxCost) + (esignCost - forecastedEsignCost);
    
    // Revenue Enablement - Additional revenue from increased capacity
    const revenueEnablement = (clientsPerYear * (capacityIncrease / 100)) * revenuePerClient;
    
    // Document Handling & Risk Avoidance - Savings from better document management
    // Separate the two components for clarity
    const docHandlingSavings = (docHandlingHours - forecastedDocHandlingHours) * docAdminRate;
    const riskBufferSavings = docRiskBuffer - forecastedDocRiskBuffer;
    const docHandlingBenefit = docHandlingSavings + riskBufferSavings;
    
    // Total Annual Benefits (savings + new revenue)
    const totalAnnualBenefits = laborEfficiency + errorReduction + softwareConsolidation + docHandlingBenefit + revenueEnablement;
    
    // Total Annual Savings (cost reductions only, excluding new revenue)
    const totalAnnualSavings = laborEfficiency + errorReduction + softwareConsolidation + docHandlingBenefit;
    
    // Implementation Costs
    const implementationCost = implementationType === 'sugarcrm' ? crmImplementationCost : 150000;
    const annualLicenseCost = implementationType === 'sugarcrm' ? annualCrmLicense : 75000;
    
    // Total Annual Costs
    const totalAnnualCosts = annualLicenseCost;
    
    // Payback Period (months) - using implementation cost as investment
    // Only use cost savings for payback calculation, not new revenue
    const paybackPeriod = totalAnnualSavings > 0 ? (implementationCost / totalAnnualSavings) * 12 : 0;
    
    // ROI % - (Annual Benefits - Annual Costs) / Implementation Cost
    const roi = implementationCost > 0 ? ((totalAnnualBenefits - totalAnnualCosts) / implementationCost) * 100 : 0;
    
    // 3-Year NPV calculation
    const discountRate = 0.1; // 10% discount rate
    const annualNetBenefit = totalAnnualBenefits - totalAnnualCosts;
    const year1NPV = annualNetBenefit / Math.pow(1 + discountRate, 1);
    const year2NPV = annualNetBenefit / Math.pow(1 + discountRate, 2);
    const year3NPV = annualNetBenefit / Math.pow(1 + discountRate, 3);
    const threeYearNPV = year1NPV + year2NPV + year3NPV - implementationCost;
    
    return {
      laborEfficiency,
      errorReduction,
      softwareConsolidation,
      revenueEnablement,
      docHandlingBenefit,
      totalAnnualSavings,
      totalAnnualBenefits,
      totalAnnualCosts,
      paybackPeriod,
      roi,
      threeYearNPV,
      // Add forecasted values for display
      forecastedOnboardingTime,
      forecastedDuplicateRate,
      forecastedResolutionTime,
      forecastedCanopyCost,
      forecastedDropboxCost,
      forecastedEsignCost,
      forecastedDocHandlingHours,
      forecastedDocRiskBuffer
    };
  }

  const results = calculateResults()

  const getCredibilityWarning = () => {
    if (results.roi > 500) {
      return "ROI above 500% may face credibility challenges with executives. Consider more conservative assumptions."
    }
    return null
  }

  const getROIColor = () => {
    if (results.roi > 1000) return '#FF6B6B'
    if (results.roi > 500) return '#FFB347'
    return '#3DF08A'
  }

  // Helper function to get color for improvement indicators
  const getImprovementColor = (metric, baselineValue, forecastedValue) => {
    // For most metrics, a reduction is good (green), increase is bad (red)
    // For capacity gain, an increase is good (green)
    
    if (metric === 'Capacity Gain (%)') {
      // For capacity gain, positive is good
      return forecastedValue > baselineValue ? '#3DF08A' : '#FF6B6B'
    }
    
    // For all other metrics, reduction is good (green), increase is bad (red)
    return forecastedValue < baselineValue ? '#3DF08A' : '#FF6B6B'
  }

  const credibilityWarning = getCredibilityWarning()

  // Sensitivity Analysis Data
  const sensitivityData = [
    { factor: 'Conversion Rate', impact: 35 },
    { factor: 'Response Time', impact: 28 },
    { factor: 'Retention', impact: 20 },
    { factor: 'Training Savings', impact: 17 }
  ]

  // Calculate TCO for both options
  const calculateTCO = () => {
    const sugarcrmTCO = {
      initial: crmImplementationCost,
      annual: annualCrmLicense,
      threeYear: crmImplementationCost + (annualCrmLicense * 3),
      timeline: {
        min: 3,
        max: 6,
        current: implementationTimeline
      }
    }

    const homegrownTCO = {
      initial: 150000, // Fixed initial cost
      annual: 75000, // Minimum annual maintenance
      threeYear: 150000 + (75000 * 3),
      timeline: {
        min: 9,
        max: 15,
        current: implementationTimeline
      }
    }

    return {
      sugarcrm: sugarcrmTCO,
      homegrown: homegrownTCO,
      lowerTCO: sugarcrmTCO.threeYear <= homegrownTCO.threeYear ? 'sugarcrm' : 'homegrown'
    }
  }

  const tco = calculateTCO()

  // Update timeline when implementation type changes
  useEffect(() => {
    if (implementationType === 'sugarcrm') {
      setImplementationTimeline(3) // Default to minimum for SugarCRM
    } else {
      setImplementationTimeline(9) // Default to minimum for Homegrown
    }
  }, [implementationType])

  // Copy variables from another scenario into the current scenario
  const copyScenarioVariables = (fromScenario) => {
    if (savedScenarios[fromScenario]) {
      const saved = savedScenarios[fromScenario];
      // Business Metrics
      setClientsPerYear(saved.clientsPerYear || 2000);
      setOnboardingTimePre(saved.onboardingTimePre || 3.0);
      setOnboardingTimePost(saved.onboardingTimePost || 1.5);
      setStaffHourlyRate(saved.staffHourlyRate || 50);
      setDuplicateRate(saved.duplicateRate || 5);
      setResolutionTime(saved.resolutionTime || 1.5);
      setCanopyCost(saved.canopyCost || 10000);
      setDropboxCost(saved.dropboxCost || 3000);
      setEsignCost(saved.esignCost || 3000);
      setCapacityIncrease(saved.capacityIncrease || 20);
      setRevenuePerClient(saved.revenuePerClient || 1500);
      setDocHandlingHours(saved.docHandlingHours || 300);
      setDocAdminRate(saved.docAdminRate || 40);
      setDocRiskBuffer(saved.docRiskBuffer || 5000);
      // Cost Parameters
      setCrmImplementationCost(saved.crmImplementationCost || 150000);
      setAnnualCrmLicense(saved.annualCrmLicense || 60000);
      setDevHourlyRate(saved.devHourlyRate || 75);
      setSalesHourlyRate(saved.salesHourlyRate || 35);
      setMatchmakerHourlyRate(saved.matchmakerHourlyRate || 40);
      setAdminHourlyRate(saved.adminHourlyRate || 25);
      setTrainingCostDay(saved.trainingCostDay || 500);
      // Target Improvements
      setTargetConversionRate(saved.targetConversionRate || 25);
      setTargetResponseTime(saved.targetResponseTime || 4);
      setTargetDevHoursWeek(saved.targetDevHoursWeek || 4);
      setTargetTrainingDays(saved.targetTrainingDays || 35);
      // Current Metrics
      setCurrentRetentionRate(saved.currentRetentionRate || 85);
      setCurrentUpsellingRate(saved.currentUpsellingRate || 5);
      setCurrentAdminEfficiency(saved.currentAdminEfficiency || 70);
      setCurrentErrorRate(saved.currentErrorRate || 3);
      setCurrentSalesProductivity(saved.currentSalesProductivity || 75);
      setCurrentMatchmakerProductivity(saved.currentMatchmakerProductivity || 70);
      // Additional Business Metrics
      setRetentionImprovement(saved.retentionImprovement || 2);
      setUpsellingRate(saved.upsellingRate || 8);
      setAdminEfficiencyRate(saved.adminEfficiencyRate || 3.3);
      setErrorReductionRate(saved.errorReductionRate || 1);
      setSalesProductivityRate(saved.salesProductivityRate || 15);
      setMatchmakerProductivityRate(saved.matchmakerProductivityRate || 12);
      // Forecasted Improvements
      setOnboardingTimeReduction(saved.onboardingTimeReduction || 50);
      setDuplicateRateReduction(saved.duplicateRateReduction || 60);
      setResolutionTimeReduction(saved.resolutionTimeReduction || 50);
      setCanopyCostReduction(saved.canopyCostReduction || 80);
      setDropboxCostReduction(saved.dropboxCostReduction || 100);
      setEsignCostReduction(saved.esignCostReduction || 100);
      setDocHandlingHoursReduction(saved.docHandlingHoursReduction || 40);
      setDocRiskBufferReduction(saved.docRiskBufferReduction || 50);
      // Implementation
      setImplementationType(saved.implementationType || 'sugarcrm');
      setImplementationTimeline(saved.implementationTimeline || 3);
    }
  };

  const [expandedSections, setExpandedSections] = useState({
    clientsPerYear: false,
    capacityIncrease: false,
    revenuePerClient: false,
    staffHourlyRate: false,
    onboardingTimePre: false,
    onboardingTimePost: false,
    docHandlingHours: false,
    docAdminRate: false,
    duplicateRate: false,
    resolutionTime: false,
    docRiskBuffer: false,
    canopyCost: false,
    dropboxCost: false,
    esignCost: false,
    // Forecasted improvements
    onboardingTimeReduction: false,
    duplicateRateReduction: false,
    resolutionTimeReduction: false,
    canopyCostReduction: false,
    dropboxCostReduction: false,
    esignCostReduction: false,
    docHandlingHoursReduction: false,
    docRiskBufferReduction: false
  });

  return (
    <div className="min-h-screen bg-white" id="calculator-content">
      <div className="container mx-auto px-2 py-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-2">
            {/* Faye attribution left */}
            <div className="flex items-center gap-2">
              <span className="text-[#ACACAC] text-sm">Prepared by</span>
              <img src={fayeLogo} alt="Faye" className="h-5" />
            </div>
            {/* Asterix Global branding center */}
            <div className="flex-1 flex flex-col items-center">
              <img src={asterixLogo} alt="Asterix Global Services" className="h-10 mb-1" />
              <h1 className="text-2xl font-bold" style={{color: '#168CA6'}}>Asterix Global Services</h1>
            </div>
            {/* Spacer right */}
            <div style={{width: '80px'}}></div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calculator className="h-5 w-5" style={{color: '#168CA6'}} />
            <h2 className="text-xl font-bold" style={{color: '#168CA6'}}>Client Portal ROI Calculator</h2>
          </div>
          <p className="text-base text-[#16815A] mb-0">Calculate the return on investment for a digital intake portal for insurance/reinsurance onboarding</p>
          <p className="text-xs text-[#ACACAC]">For Asterix Global Services, Inc. | Addison, Texas</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Scenario Controls */}
            <Card className="border-2" style={{borderColor: '#38003C', marginBottom: '12px', overflow: 'visible'}}>
              <CardHeader className="pb-4 pt-6" style={{backgroundColor: '#38003C', marginTop: '-1px', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
                <CardTitle className="text-white">Scenario Controls</CardTitle>
                <CardDescription className="text-white/80">
                  Save and load custom scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6" style={{overflow: 'visible'}}>
                <div className="flex flex-wrap gap-2 items-center justify-between text-sm overflow-x-auto" style={{overflow: 'visible'}}>
                  {/* Export Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      style={{ borderColor: '#16815A', color: '#16815A' }}
                      className="hover:bg-[#16815A]/15 hover:border-[#16815A] active:bg-[#16815A]/25 active:border-[#16815A] focus:ring-2 focus:ring-[#16815A]"
                      aria-label="Print or Save as PDF"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Print / PDF</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToExcel} style={{borderColor: '#16815A', color: '#16815A'}} aria-label="Export Excel" className="hover:bg-[#16815A]/15 hover:border-[#16815A] active:bg-[#16815A]/25 active:border-[#16815A] focus:ring-2 focus:ring-[#16815A]">
                      <FileSpreadsheet className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Excel</span>
                    </Button>
                  </div>
                  {/* Scenario Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowSavePrompt(true)} style={{borderColor: '#16815A', color: '#16815A'}} aria-label="Save Scenario" className="hover:bg-[#16815A]/15 hover:border-[#16815A] active:bg-[#16815A]/25 active:border-[#16815A] focus:ring-2 focus:ring-[#16815A]">
                      <Save className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetToBaseline} style={{borderColor: '#16815A', color: '#16815A'}} aria-label="Reset to Baseline" className="hover:bg-[#16815A]/15 hover:border-[#16815A] active:bg-[#16815A]/25 active:border-[#16815A] focus:ring-2 focus:ring-[#16815A]">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                    <div className="relative">
                      <Button variant="outline" size="sm" onClick={() => setShowLoadMenu((v) => !v)} style={{borderColor: '#16815A', color: '#16815A'}} aria-label="Load Scenario" className="hover:bg-[#16815A]/15 hover:border-[#16815A] active:bg-[#16815A]/25 active:border-[#16815A] focus:ring-2 focus:ring-[#16815A]">
                        <Download className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Load</span>
                      </Button>
                      {showLoadMenu && (
                        <div className="absolute z-50 mt-2 right-0 bg-white border border-gray-200 rounded shadow-lg min-w-[200px]">
                          {Object.keys(savedScenarios).length === 0 && (
                            <div className="px-4 py-2 text-gray-400 text-sm">No saved scenarios</div>
                          )}
                          {Object.keys(savedScenarios).map((name) => (
                            <div key={name} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-[#38003C] text-sm">
                              <span className="truncate max-w-[100px]">{name}</span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => { loadSavedScenario(name); setShowLoadMenu(false); }}>
                                  Load
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => deleteScenario(name)}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Save Scenario Prompt */}
                {showSavePrompt && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
                      <h3 className="text-lg font-semibold mb-2">Save Scenario</h3>
                      <input
                        className="border rounded px-2 py-1 w-full mb-2"
                        placeholder="Scenario name"
                        value={saveName}
                        onChange={e => setSaveName(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => setShowSavePrompt(false)}>Cancel</Button>
                        <Button size="sm" variant="default" onClick={() => { saveCurrentScenario(saveName); setShowSavePrompt(false); setSaveName(''); }}>Save</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Metrics */}
            <Card className="border-2" style={{borderColor: '#16815A', marginBottom: '12px'}}>
              <CardHeader className="pb-4 pt-6" style={{backgroundColor: '#16815A', marginTop: '-1px', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
                <CardTitle className="text-white">Business Metrics</CardTitle>
                <CardDescription className="text-white/80">
                  Enter your current business metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Revenue Metrics */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#16815A'}}>Revenue Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="clientsPerYear" className="mb-2">
                        Clients Onboarded per Year (Baseline)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, clientsPerYear: !prev.clientsPerYear}))}
                        >
                          {expandedSections.clientsPerYear ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.clientsPerYear && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Your current annual client onboarding volume. This baseline number is used to calculate the revenue impact of increased capacity.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="clientsPerYear"
                          value={[clientsPerYear]}
                          onValueChange={(value) => setClientsPerYear(value[0])}
                          max={5000}
                          min={1000}
                          step={100}
                        />
                        <p className='text-xs text-gray-500 mt-1'>{clientsPerYear.toLocaleString()} clients/year</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="revenuePerClient" className="mb-2">
                        Avg. Annual Revenue per Client (Baseline)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, revenuePerClient: !prev.revenuePerClient}))}
                        >
                          {expandedSections.revenuePerClient ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.revenuePerClient && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Your current average annual revenue generated per client. This recurring revenue is used to calculate the additional annual revenue from increased capacity and improved client satisfaction.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="revenuePerClient"
                          value={[revenuePerClient]}
                          onValueChange={(value) => setRevenuePerClient(value[0])}
                          max={10000}
                          min={1000}
                          step={100}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${revenuePerClient.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Labor Efficiency Metrics */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#16815A'}}>Labor Efficiency Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="staffHourlyRate" className="mb-2">
                        Avg. Staff Cost per Hour (Baseline)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, staffHourlyRate: !prev.staffHourlyRate}))}
                        >
                          {expandedSections.staffHourlyRate ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.staffHourlyRate && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Your current average hourly cost for staff involved in onboarding and document management. This is used to calculate labor savings from reduced manual work.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="staffHourlyRate"
                          value={[staffHourlyRate]}
                          onValueChange={(value) => setStaffHourlyRate(value[0])}
                          max={75}
                          min={35}
                          step={1}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${staffHourlyRate.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} per hour</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="onboardingTimePre" className="mb-2">
                        Onboarding Time - Current (hours)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, onboardingTimePre: !prev.onboardingTimePre}))}
                        >
                          {expandedSections.onboardingTimePre ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.onboardingTimePre && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          The average time currently spent onboarding each client, including manual document collection, follow-ups, and administrative tasks.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="onboardingTimePre"
                          value={[onboardingTimePre]}
                          onValueChange={(value) => setOnboardingTimePre(value[0])}
                          max={4}
                          min={0.5}
                          step={0.01}
                        />
                        <p className='text-xs text-gray-500 mt-1'>{onboardingTimePre.toFixed(2)} hours</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="onboardingTimePost" className="mb-2">
                        Onboarding Time - With Portal (hours)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, onboardingTimePost: !prev.onboardingTimePost}))}
                        >
                          {expandedSections.onboardingTimePost ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.onboardingTimePost && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          The projected time to onboard each client with the digital portal, accounting for automated workflows, self-service document uploads, and reduced manual intervention.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="onboardingTimePost"
                          value={[onboardingTimePost]}
                          onValueChange={(value) => setOnboardingTimePost(value[0])}
                          max={4}
                          min={0.5}
                          step={0.01}
                        />
                        <p className='text-xs text-gray-500 mt-1'>{onboardingTimePost.toFixed(2)} hours</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="docHandlingHours" className="mb-2">
                        Total Document Handling Hours - Current (annual)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, docHandlingHours: !prev.docHandlingHours}))}
                        >
                          {expandedSections.docHandlingHours ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.docHandlingHours && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Total annual hours across all staff currently spent managing documents, signatures, follow-ups, and administrative tasks related to client onboarding and maintenance. This is the aggregate time spent by your entire team.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="docHandlingHours"
                          value={[docHandlingHours]}
                          onValueChange={(value) => setDocHandlingHours(value[0])}
                          max={1000}
                          min={100}
                          step={10}
                        />
                        <p className='text-xs text-gray-500 mt-1'>{docHandlingHours.toLocaleString()} hours</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="docAdminRate" className="mb-2">
                        Admin Rate for Document Handling (Baseline)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, docAdminRate: !prev.docAdminRate}))}
                        >
                          {expandedSections.docAdminRate ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.docAdminRate && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          The hourly rate for administrative staff who handle document management tasks. This is used to calculate the cost savings from reduced manual document work.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="docAdminRate"
                          value={[docAdminRate]}
                          onValueChange={(value) => setDocAdminRate(value[0])}
                          max={75}
                          min={25}
                          step={1}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${docAdminRate.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} per hour</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Reduction Metrics */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#16815A'}}>Error Reduction Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="duplicateRate" className="mb-2">
                        Duplicate/Rework Rate - Current (%)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, duplicateRate: !prev.duplicateRate}))}
                        >
                          {expandedSections.duplicateRate ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.duplicateRate && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          The current percentage of onboarding processes that require rework due to missing documents, incorrect information, or duplicate submissions. This impacts both time and costs.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="duplicateRate"
                          value={[duplicateRate]}
                          onValueChange={(value) => setDuplicateRate(value[0])}
                          max={10}
                          min={2}
                          step={0.1}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        <p className='text-xs text-gray-500 mt-1'>{duplicateRate.toFixed(2)}%</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="resolutionTime" className="mb-2">
                        Resolution Time per Issue - Current (hours)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, resolutionTime: !prev.resolutionTime}))}
                        >
                          {expandedSections.resolutionTime ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.resolutionTime && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          The average time spent resolving issues like missing documents, incorrect submissions, or client follow-ups. This includes communication time and administrative overhead.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="resolutionTime"
                          value={[resolutionTime]}
                          onValueChange={(value) => setResolutionTime(value[0])}
                          max={3}
                          min={0.5}
                          step={0.01}
                        />
                        <p className='text-xs text-gray-500 mt-1'>{resolutionTime.toFixed(2)} hours</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="docRiskBuffer" className="mb-2">
                        Document Risk Buffer - Current (annual)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, docRiskBuffer: !prev.docRiskBuffer}))}
                        >
                          {expandedSections.docRiskBuffer ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.docRiskBuffer && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          The annual cost buffer you currently maintain for document-related risks, including compliance issues, lost documents, audit findings, and potential legal costs from manual processes.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="docRiskBuffer"
                          value={[docRiskBuffer]}
                          onValueChange={(value) => setDocRiskBuffer(value[0])}
                          max={50000}
                          min={5000}
                          step={1000}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${docRiskBuffer.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Subscription Costs */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#16815A'}}>Current Subscription Costs (Annual)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="canopyCost" className="mb-2">
                        Canopy Subscription Cost
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, canopyCost: !prev.canopyCost}))}
                        >
                          {expandedSections.canopyCost ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.canopyCost && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Your current annual cost for Canopy or similar practice management software. This will be replaced or reduced by the new portal solution.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="canopyCost"
                          value={[canopyCost]}
                          onValueChange={(value) => setCanopyCost(value[0])}
                          max={20000}
                          min={5000}
                          step={1000}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${canopyCost.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dropboxCost" className="mb-2">
                        Dropbox Cost
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, dropboxCost: !prev.dropboxCost}))}
                        >
                          {expandedSections.dropboxCost ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.dropboxCost && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Your current annual cost for Dropbox or similar file storage/sharing services. The portal will provide integrated document management capabilities.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="dropboxCost"
                          value={[dropboxCost]}
                          onValueChange={(value) => setDropboxCost(value[0])}
                          max={5000}
                          min={1000}
                          step={1000}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${dropboxCost.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="esignCost" className="mb-2">
                        DocuSign/e-sign Cost
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, esignCost: !prev.esignCost}))}
                        >
                          {expandedSections.esignCost ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.esignCost && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Your current annual cost for DocuSign or similar electronic signature services. The portal will include integrated e-signature capabilities.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="esignCost"
                          value={[esignCost]}
                          onValueChange={(value) => setEsignCost(value[0])}
                          max={5000}
                          min={1000}
                          step={1000}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${esignCost.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forecasted Improvements */}
            <Card className="border-2" style={{borderColor: '#FFB347'}}>
              <CardHeader className="pb-4 pt-6" style={{backgroundColor: '#FFB347', marginTop: '-1px', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
                <CardTitle className="text-white">Forecasted Improvements</CardTitle>
                <CardDescription className="text-white/80">
                  Specify expected improvements with the new portal solution
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Process Efficiency Improvements */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#FFB347'}}>Process Efficiency Improvements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="onboardingTimeReduction" className="mb-2">
                        Onboarding Time Reduction (%)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, onboardingTimeReduction: !prev.onboardingTimeReduction}))}
                        >
                          {expandedSections.onboardingTimeReduction ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.onboardingTimeReduction && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Expected percentage reduction in onboarding time per client with the new portal. This drives labor efficiency savings.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="onboardingTimeReduction"
                          value={[onboardingTimeReduction]}
                          onValueChange={(value) => setOnboardingTimeReduction(value[0])}
                          max={80}
                          min={0}
                          step={5}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        <p className='text-xs text-gray-500 mt-1'>{onboardingTimeReduction}% reduction (from {onboardingTimePre.toFixed(1)}h to {results.forecastedOnboardingTime?.toFixed(1)}h)</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="duplicateRateReduction" className="mb-2">
                        Duplicate/Rework Rate Reduction (%)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, duplicateRateReduction: !prev.duplicateRateReduction}))}
                        >
                          {expandedSections.duplicateRateReduction ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.duplicateRateReduction && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Expected percentage reduction in duplicate submissions and rework due to better document validation and workflow automation.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="duplicateRateReduction"
                          value={[duplicateRateReduction]}
                          onValueChange={(value) => setDuplicateRateReduction(value[0])}
                          max={90}
                          min={0}
                          step={5}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        <p className='text-xs text-gray-500 mt-1'>{duplicateRateReduction}% reduction (from {duplicateRate.toFixed(1)}% to {results.forecastedDuplicateRate?.toFixed(1)}%)</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="resolutionTimeReduction" className="mb-2">
                        Issue Resolution Time Reduction (%)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, resolutionTimeReduction: !prev.resolutionTimeReduction}))}
                        >
                          {expandedSections.resolutionTimeReduction ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.resolutionTimeReduction && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Expected percentage reduction in time spent resolving issues due to better document management and automated workflows.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="resolutionTimeReduction"
                          value={[resolutionTimeReduction]}
                          onValueChange={(value) => setResolutionTimeReduction(value[0])}
                          max={80}
                          min={0}
                          step={5}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        <p className='text-xs text-gray-500 mt-1'>{resolutionTimeReduction}% reduction (from {resolutionTime.toFixed(1)}h to {results.forecastedResolutionTime?.toFixed(1)}h)</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="docHandlingHoursReduction" className="mb-2">
                        Document Handling Hours Reduction (%)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, docHandlingHoursReduction: !prev.docHandlingHoursReduction}))}
                        >
                          {expandedSections.docHandlingHoursReduction ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.docHandlingHoursReduction && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Expected percentage reduction in annual hours spent on document handling due to automation and better organization.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="docHandlingHoursReduction"
                          value={[docHandlingHoursReduction]}
                          onValueChange={(value) => setDocHandlingHoursReduction(value[0])}
                          max={70}
                          min={0}
                          step={5}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        <p className='text-xs text-gray-500 mt-1'>{docHandlingHoursReduction}% reduction (from {docHandlingHours}h to {results.forecastedDocHandlingHours?.toFixed(0)}h)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Reduction Improvements */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#FFB347'}}>Cost Reduction Improvements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="canopyCostReduction" className="mb-2">
                        Canopy Cost Reduction (%)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, canopyCostReduction: !prev.canopyCostReduction}))}
                        >
                          {expandedSections.canopyCostReduction ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.canopyCostReduction && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Expected percentage reduction in Canopy subscription costs as the portal replaces some functionality.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="canopyCostReduction"
                          value={[canopyCostReduction]}
                          onValueChange={(value) => setCanopyCostReduction(value[0])}
                          max={100}
                          min={0}
                          step={10}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        <p className='text-xs text-gray-500 mt-1'>{canopyCostReduction}% reduction (from ${canopyCost.toLocaleString()} to ${results.forecastedCanopyCost?.toLocaleString()})</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dropboxCostReduction" className="mb-2">
                        Dropbox Cost Reduction (%)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, dropboxCostReduction: !prev.dropboxCostReduction}))}
                        >
                          {expandedSections.dropboxCostReduction ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.dropboxCostReduction && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Expected percentage reduction in Dropbox costs as the portal provides integrated document storage.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="dropboxCostReduction"
                          value={[dropboxCostReduction]}
                          onValueChange={(value) => setDropboxCostReduction(value[0])}
                          max={100}
                          min={0}
                          step={10}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        <p className='text-xs text-gray-500 mt-1'>{dropboxCostReduction}% reduction (from ${dropboxCost.toLocaleString()} to ${results.forecastedDropboxCost?.toLocaleString()})</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="esignCostReduction" className="mb-2">
                        DocuSign/e-sign Cost Reduction (%)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, esignCostReduction: !prev.esignCostReduction}))}
                        >
                          {expandedSections.esignCostReduction ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.esignCostReduction && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Expected percentage reduction in DocuSign costs as the portal includes integrated e-signature capabilities.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="esignCostReduction"
                          value={[esignCostReduction]}
                          onValueChange={(value) => setEsignCostReduction(value[0])}
                          max={100}
                          min={0}
                          step={10}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        <p className='text-xs text-gray-500 mt-1'>{esignCostReduction}% reduction (from ${esignCost.toLocaleString()} to ${results.forecastedEsignCost?.toLocaleString()})</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="docRiskBufferReduction" className="mb-2">
                        Document Risk Buffer Reduction (%)
                        <button 
                          className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={() => setExpandedSections(prev => ({...prev, docRiskBufferReduction: !prev.docRiskBufferReduction}))}
                        >
                          {expandedSections.docRiskBufferReduction ? '−' : '+'}
                        </button>
                      </Label>
                      {expandedSections.docRiskBufferReduction && (
                        <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          Expected percentage reduction in document risk buffer due to better compliance, audit trails, and reduced manual errors.
                        </div>
                      )}
                      <div className="relative">
                        <Slider
                          id="docRiskBufferReduction"
                          value={[docRiskBufferReduction]}
                          onValueChange={(value) => setDocRiskBufferReduction(value[0])}
                          max={80}
                          min={0}
                          step={5}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                        <p className='text-xs text-gray-500 mt-1'>{docRiskBufferReduction}% reduction (from ${docRiskBuffer.toLocaleString()} to ${results.forecastedDocRiskBuffer?.toLocaleString()})</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="capacityIncrease" className="mb-2">
                    Capacity Gain (%)
                    <button 
                      className="ml-1 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={() => setExpandedSections(prev => ({...prev, capacityIncrease: !prev.capacityIncrease}))}
                    >
                      {expandedSections.capacityIncrease ? '−' : '+'}
                    </button>
                  </Label>
                  {expandedSections.capacityIncrease && (
                    <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      The percentage increase in client capacity you expect to achieve with the portal. This accounts for faster onboarding and reduced manual work, allowing you to handle more clients with the same staff.
                    </div>
                  )}
                  <div className="relative">
                    <Slider
                      id="capacityIncrease"
                      value={[capacityIncrease]}
                      onValueChange={(value) => setCapacityIncrease(value[0])}
                      max={50}
                      min={0}
                      step={1}
                    />
                    <p className='text-xs text-gray-500 mt-1'>{capacityIncrease.toFixed(2)}% increase</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Parameters */}
            <Card className="border-2" style={{borderColor: '#04DFC6'}}>
              <CardHeader className="pb-4 pt-6" style={{backgroundColor: '#04DFC6', marginTop: '-1px', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
                <CardTitle className="text-white">Cost Parameters</CardTitle>
                <CardDescription className="text-white/80">
                  Configure implementation and operational costs
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="implementationType" className="mb-2">Implementation Type</Label>
                    <select
                      id="implementationType"
                      value={implementationType}
                      onChange={(e) => setImplementationType(e.target.value)}
                      className="w-full p-2 border rounded-md border-[#04DFC6] focus:border-[#04DFC6] focus:outline-none"
                    >
                      <option value="sugarcrm">SugarCRM + Faye</option>
                      <option value="homegrown">Homegrown Solution</option>
                    </select>
                  </div>
                </div>

                {/* One-Time Costs */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#04DFC6'}}>One-Time Costs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="crmImplementationCost" className="mb-2">Initial Implementation Cost</Label>
                      <div className="relative">
                        <Slider
                          id="crmImplementationCost"
                          value={[crmImplementationCost]}
                          onValueChange={(value) => setCrmImplementationCost(value[0])}
                          max={500000}
                          min={50000}
                          step={5000}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${crmImplementationCost.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="implementationTimeline" className="mb-2">Implementation Timeline (months)</Label>
                      <div className="relative">
                        <Slider
                          id="implementationTimeline"
                          value={[implementationTimeline]}
                          onValueChange={(value) => setImplementationTimeline(value[0])}
                          max={18}
                          min={3}
                          step={1}
                        />
                        <p className='text-xs text-gray-500 mt-1'>{implementationTimeline.toLocaleString()} months</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="devHourlyRate" className="mb-2">Developer Hourly Rate</Label>
                      <div className="relative">
                        <Slider
                          id="devHourlyRate"
                          value={[devHourlyRate]}
                          onValueChange={(value) => setDevHourlyRate(value[0])}
                          max={200}
                          min={75}
                          step={5}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${devHourlyRate.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} per hour</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="trainingCostDay" className="mb-2">Training Cost per Day</Label>
                      <div className="relative">
                        <Slider
                          id="trainingCostDay"
                          value={[trainingCostDay]}
                          onValueChange={(value) => setTrainingCostDay(value[0])}
                          max={5000}
                          min={1000}
                          step={100}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${trainingCostDay.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recurring Costs */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#04DFC6'}}>Recurring Costs (Annual)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="annualCrmLicense" className="mb-2">Annual License/Maintenance</Label>
                      <div className="relative">
                        <Slider
                          id="annualCrmLicense"
                          value={[annualCrmLicense]}
                          onValueChange={(value) => setAnnualCrmLicense(value[0])}
                          max={100000}
                          min={10000}
                          step={1000}
                        />
                        <p className='text-xs text-gray-500 mt-1'>${annualCrmLicense.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Build vs Buy Comparison */}
            <Card className="border-2" style={{borderColor: '#B2F000'}}>
              <CardHeader className="pb-4 pt-6" style={{backgroundColor: '#B2F000', marginTop: '-1px', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
                <CardTitle className="text-white">Build vs Buy Comparison</CardTitle>
                <CardDescription className="text-white/80">
                  Compare the total cost of ownership between options
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* SugarCRM + Faye */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: '#7A39ED'}}>
                      SugarCRM + Faye
                      {tco.lowerTCO === 'sugarcrm' && (
                        <>
                          <CheckCircle className="h-5 w-5" style={{color: '#16815A'}} />
                          <span className="text-sm font-normal text-[#ACACAC]">(Lower TCO)</span>
                        </>
                      )}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Initial Cost:</span>
                        <span>${formatCurrency(tco.sugarcrm.initial)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Annual License:</span>
                        <span>${formatCurrency(tco.sugarcrm.annual)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Timeline:</span>
                        <span>
                          {tco.sugarcrm.timeline.current} months
                          <span className="text-sm text-[#ACACAC] ml-1">
                            ({tco.sugarcrm.timeline.min}-{tco.sugarcrm.timeline.max} months)
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">3-Year TCO:</span>
                        <span>${formatCurrency(tco.sugarcrm.threeYear)}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2" style={{color: '#7A39ED'}}>Key Benefits</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Fast deployment (3-6 months)</li>
                        <li>Low-code configuration</li>
                        <li>Built-in dashboards & workflows</li>
                        <li>Partner support included</li>
                        <li>Integrated payment & contracts</li>
                      </ul>
                    </div>
                  </div>

                  {/* Homegrown Solution */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: '#04DFC6'}}>
                      Homegrown Solution
                      {tco.lowerTCO === 'homegrown' && (
                        <>
                          <CheckCircle className="h-5 w-5" style={{color: '#16815A'}} />
                          <span className="text-sm font-normal text-[#ACACAC]">(Lower TCO)</span>
                        </>
                      )}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Initial Cost:</span>
                        <span>${formatCurrency(tco.homegrown.initial)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Annual Maintenance:</span>
                        <span>${formatCurrency(tco.homegrown.annual)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Timeline:</span>
                        <span>
                          {tco.homegrown.timeline.current} months
                          <span className="text-sm text-[#ACACAC] ml-1">
                            ({tco.homegrown.timeline.min}-{tco.homegrown.timeline.max} months)
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">3-Year TCO:</span>
                        <span>${formatCurrency(tco.homegrown.threeYear)}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2" style={{color: '#04DFC6'}}>Key Considerations</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Long build timeline (9-15+ months)</li>
                        <li>Requires internal product & dev team</li>
                        <li>High total cost of ownership</li>
                        <li>Compliance & security responsibility</li>
                        <li>Business becomes a tech company</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Just before the closing </div> for the left column (the first </div> after all input/configuration cards): */}
            <Card className="border-2" style={{ borderColor: '#168CA6', marginTop: '16px', background: '#F8FCFD' }}>
              <CardHeader className="pb-2 pt-4" style={{ background: 'transparent', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}>
                <CardTitle className="text-[#168CA6] font-bold">Strategic & Qualitative Benefits</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 pb-4">
                <ul className="list-disc list-inside text-sm text-[#168CA6] space-y-1">
                  <li>Enhanced client satisfaction and retention</li>
                  <li>Shorter sales/onboarding cycles</li>
                  <li>Improved audit/compliance posture</li>
                  <li>Increased staff retention due to less burnout</li>
                  <li>Brand elevation via digital maturity</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-8">
            {/* Results Summary */}
            <Card className="border-2 sticky top-8" style={{
              borderColor: '#38003C',
              marginBottom: '12px',
              background: 'linear-gradient(90deg, rgba(56,0,60,0.75) 0%, rgba(122,57,237,0.75) 100%)',
              color: 'white'
            }}>
              <CardHeader className="pb-4 pt-6" style={{
                background: 'transparent',
                marginTop: '-1px',
                borderTopLeftRadius: '0.5rem',
                borderTopRightRadius: '0.5rem'
              }}>
                <CardTitle className="text-white font-bold">Results Summary</CardTitle>
                <CardDescription className="text-white" style={{opacity: 0.92}}>
                  Key ROI metrics and breakdown (using forecasted improvements)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Baseline vs Forecasted Table */}
                <div className="mb-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs text-white border-separate border-spacing-y-1">
                      <thead>
                        <tr>
                          <th className="pr-4 pb-1 text-left">Metric</th>
                          <th className="pr-4 pb-1 text-right">Baseline</th>
                          <th className="pr-4 pb-1 text-right">Forecasted</th>
                          <th className="pb-1 text-right">Improvement</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Onboarding Time (hrs)</td>
                          <td className="text-right">{onboardingTimePre.toFixed(2)}</td>
                          <td className="text-right">{results.forecastedOnboardingTime?.toFixed(2)}</td>
                          <td className="text-right" style={{color: getImprovementColor('Onboarding Time (hrs)', onboardingTimePre, results.forecastedOnboardingTime)}}>
                            {(100 * (1 - results.forecastedOnboardingTime / onboardingTimePre)).toFixed(0)}%
                          </td>
                        </tr>
                        <tr>
                          <td>Duplicate Rate (%)</td>
                          <td className="text-right">{duplicateRate.toFixed(2)}</td>
                          <td className="text-right">{results.forecastedDuplicateRate?.toFixed(2)}</td>
                          <td className="text-right" style={{color: getImprovementColor('Duplicate Rate (%)', duplicateRate, results.forecastedDuplicateRate)}}>
                            {(100 * (1 - results.forecastedDuplicateRate / duplicateRate)).toFixed(0)}%
                          </td>
                        </tr>
                        <tr>
                          <td>Resolution Time (hrs)</td>
                          <td className="text-right">{resolutionTime.toFixed(2)}</td>
                          <td className="text-right">{results.forecastedResolutionTime?.toFixed(2)}</td>
                          <td className="text-right" style={{color: getImprovementColor('Resolution Time (hrs)', resolutionTime, results.forecastedResolutionTime)}}>
                            {(100 * (1 - results.forecastedResolutionTime / resolutionTime)).toFixed(0)}%
                          </td>
                        </tr>
                        <tr>
                          <td>Canopy Cost ($)</td>
                          <td className="text-right">{canopyCost.toLocaleString()}</td>
                          <td className="text-right">{results.forecastedCanopyCost?.toLocaleString()}</td>
                          <td className="text-right" style={{color: getImprovementColor('Canopy Cost ($)', canopyCost, results.forecastedCanopyCost)}}>
                            {(100 * (1 - results.forecastedCanopyCost / canopyCost)).toFixed(0)}%
                          </td>
                        </tr>
                        <tr>
                          <td>Dropbox Cost ($)</td>
                          <td className="text-right">{dropboxCost.toLocaleString()}</td>
                          <td className="text-right">{results.forecastedDropboxCost?.toLocaleString()}</td>
                          <td className="text-right" style={{color: getImprovementColor('Dropbox Cost ($)', dropboxCost, results.forecastedDropboxCost)}}>
                            {(100 * (1 - results.forecastedDropboxCost / dropboxCost)).toFixed(0)}%
                          </td>
                        </tr>
                        <tr>
                          <td>Esign Cost ($)</td>
                          <td className="text-right">{esignCost.toLocaleString()}</td>
                          <td className="text-right">{results.forecastedEsignCost?.toLocaleString()}</td>
                          <td className="text-right" style={{color: getImprovementColor('Esign Cost ($)', esignCost, results.forecastedEsignCost)}}>
                            {(100 * (1 - results.forecastedEsignCost / esignCost)).toFixed(0)}%
                          </td>
                        </tr>
                        <tr>
                          <td>Doc Handling Hours (annual)</td>
                          <td className="text-right">{docHandlingHours.toLocaleString()}</td>
                          <td className="text-right">{results.forecastedDocHandlingHours?.toLocaleString()}</td>
                          <td className="text-right" style={{color: getImprovementColor('Doc Handling Hours (annual)', docHandlingHours, results.forecastedDocHandlingHours)}}>
                            {(100 * (1 - results.forecastedDocHandlingHours / docHandlingHours)).toFixed(0)}%
                          </td>
                        </tr>
                        <tr>
                          <td>Doc Risk Buffer ($)</td>
                          <td className="text-right">{docRiskBuffer.toLocaleString()}</td>
                          <td className="text-right">{results.forecastedDocRiskBuffer?.toLocaleString()}</td>
                          <td className="text-right" style={{color: getImprovementColor('Doc Risk Buffer ($)', docRiskBuffer, results.forecastedDocRiskBuffer)}}>
                            {(100 * (1 - results.forecastedDocRiskBuffer / docRiskBuffer)).toFixed(0)}%
                          </td>
                        </tr>
                        <tr>
                          <td>Capacity Gain (%)</td>
                          <td className="text-right">0</td>
                          <td className="text-right">{capacityIncrease.toFixed(2)}</td>
                          <td className="text-right" style={{color: getImprovementColor('Capacity Gain (%)', 0, capacityIncrease)}}>
                            {capacityIncrease.toFixed(2)}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Existing summary below */}
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-white font-semibold">Total Annual Benefits</div>
                    <div className="text-xl font-semibold" style={{color: '#3DF08A'}}>${formatCurrency(results.totalAnnualBenefits)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white font-semibold">Total Annual Costs</div>
                    <div className="text-xl font-semibold" style={{color: '#B39BFF'}}>${formatCurrency(results.totalAnnualCosts)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white font-semibold">ROI</div>
                    <div className="text-xl font-semibold" style={{color: getROIColor()}}>{results.roi.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-white font-semibold">Payback Period</div>
                    <div className="text-xl font-semibold text-white">{results.paybackPeriod.toFixed(1)} months</div>
                  </div>
                  <div>
                    <div className="text-sm text-white font-semibold">3-Year NPV</div>
                    <div className="text-xl font-semibold" style={{color: '#3DF08A'}}>${formatCurrency(results.threeYearNPV)}</div>
                  </div>
                  <Separator className="bg-white/40" />
                  <div>
                    <div className="text-sm text-white font-semibold mb-2">Benefits Breakdown</div>
                    <div className="h-[200px] bg-white rounded-lg p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[
                            { name: 'Labor Efficiency', value: results.laborEfficiency, color: '#7A39ED' },
                            { name: 'Error Reduction', value: results.errorReduction, color: '#04DFC6' },
                            { name: 'Software Consolidation', value: results.softwareConsolidation, color: '#B2F000' },
                            { name: 'Revenue Enablement', value: results.revenueEnablement, color: '#168CA6' },
                            { name: 'Doc Handling & Risk', value: results.docHandlingBenefit, color: '#FFB347' }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#ACACAC" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#38003C"
                            tick={{ fill: '#38003C', fontSize: 11 }}
                            tickLine={{ stroke: '#38003C' }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            stroke="#38003C"
                            tick={{ fill: '#38003C', fontSize: 11 }}
                            tickLine={{ stroke: '#38003C' }}
                            tickFormatter={(value) => `$${formatCurrency(value)}`}
                          />
                          <RechartsTooltip 
                            formatter={(value) => `$${formatCurrency(value)}`}
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #38003C',
                              borderRadius: '4px',
                              padding: '8px'
                            }}
                          />
                          <Bar dataKey="value" fill="#38003C">
                            {results.laborEfficiency > 0 && (
                              <Cell fill="#7A39ED" />
                            )}
                            {results.errorReduction > 0 && (
                              <Cell fill="#04DFC6" />
                            )}
                            {results.softwareConsolidation > 0 && (
                              <Cell fill="#B2F000" />
                            )}
                            {results.revenueEnablement > 0 && (
                              <Cell fill="#168CA6" />
                            )}
                            {results.docHandlingBenefit > 0 && (
                              <Cell fill="#FFB347" />
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Credibility Warning */}
        {credibilityWarning && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              {credibilityWarning}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App