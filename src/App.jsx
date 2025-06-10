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

// Import logos
import fayeLogo from './assets/faye-logo.png'
import ijlLogo from './assets/ijl-logo.png'

function App() {
  // Current Business Metrics
  const [annualRevenue, setAnnualRevenue] = useState(24000000)
  const [monthlyLeads, setMonthlyLeads] = useState(833)
  const [currentConversionRate, setCurrentConversionRate] = useState(22)
  const [avgCustomerValue, setAvgCustomerValue] = useState(3000)
  const [currentResponseTime, setCurrentResponseTime] = useState(24)
  const [salesStaff, setSalesStaff] = useState(25)
  const [matchmakers, setMatchmakers] = useState(35)
  const [devHoursWeek, setDevHoursWeek] = useState(8)
  const [newHiresYear, setNewHiresYear] = useState(8)

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

  // Helper function to format currency without cents
  const formatCurrency = (amount) => {
    return Math.round(amount).toLocaleString()
  }

  // Reset all improvement metrics to baseline (no impact)
  const resetToBaseline = () => {
    // Set target values equal to current values
    setTargetConversionRate(currentConversionRate)
    setTargetResponseTime(currentResponseTime)
    setTargetDevHoursWeek(devHoursWeek)
    setTargetTrainingDays(0)
    
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
      annualRevenue, monthlyLeads, currentConversionRate, avgCustomerValue,
      currentResponseTime, salesStaff, matchmakers, devHoursWeek, newHiresYear,
      crmImplementationCost, annualCrmLicense, devHourlyRate, salesHourlyRate,
      matchmakerHourlyRate, adminHourlyRate, trainingCostDay, targetConversionRate,
      targetResponseTime, targetDevHoursWeek, targetTrainingDays,
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
      setAnnualRevenue(saved.annualRevenue);
      setMonthlyLeads(saved.monthlyLeads);
      setCurrentConversionRate(saved.currentConversionRate);
      setAvgCustomerValue(saved.avgCustomerValue);
      setCurrentResponseTime(saved.currentResponseTime);
      setSalesStaff(saved.salesStaff);
      setMatchmakers(saved.matchmakers);
      setDevHoursWeek(saved.devHoursWeek);
      setNewHiresYear(saved.newHiresYear);
      setCrmImplementationCost(saved.crmImplementationCost);
      setAnnualCrmLicense(saved.annualCrmLicense);
      setDevHourlyRate(saved.devHourlyRate);
      setSalesHourlyRate(saved.salesHourlyRate);
      setMatchmakerHourlyRate(saved.matchmakerHourlyRate);
      setAdminHourlyRate(saved.adminHourlyRate);
      setTrainingCostDay(saved.trainingCostDay);
      setTargetConversionRate(saved.targetConversionRate);
      setTargetResponseTime(saved.targetResponseTime);
      setTargetDevHoursWeek(saved.targetDevHoursWeek);
      setTargetTrainingDays(saved.targetTrainingDays);
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
      ['CRM ROI Calculator Results', ''],
      ['Scenario', 'Custom'],
      ['Generated', new Date().toLocaleDateString()],
      ['', ''],
      ['Summary', ''],
      ['Total Annual Benefits', `$${formatCurrency(results.totalBenefits)}`],
      ['Total Annual Costs', `$${formatCurrency(results.totalCosts)}`],
      ['ROI', `${results.roi.toFixed(1)}%`],
      ['Payback Period', `${results.paybackPeriod.toFixed(1)} months`],
      ['3-Year NPV', `$${formatCurrency(results.threeYearNPV)}`],
      ['', ''],
      ['Benefits Breakdown', ''],
      ['Revenue Uplift', `$${formatCurrency(results.breakdown.revenueUplift.total)}`],
      ['Cost Savings', `$${formatCurrency(results.breakdown.costSavings.total)}`],
      ['Productivity Gains', `$${formatCurrency(results.breakdown.productivityGains.total)}`]
    ]
    
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'ROI Analysis')
    XLSX.writeFile(wb, `CRM-ROI-Calculator-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const calculateResults = () => {
    // Apply scenario multipliers
    let riskFactor = 1
    let implementationSuccess = 0.85
    
    // Revenue Uplift Calculations
    const conversionImprovement = Math.max(0, (targetConversionRate - currentConversionRate) / 100)
    const responseTimeImprovement = Math.max(0, (currentResponseTime - targetResponseTime) * 0.03)
    const retentionImprovementValue = Math.max(0, retentionImprovement / 100)
    const upsellingRateValue = Math.max(0, upsellingRate / 100)

    const revenueUplift = {
      conversion: monthlyLeads * 12 * conversionImprovement * avgCustomerValue * riskFactor,
      responseTime: annualRevenue * responseTimeImprovement * riskFactor,
      retention: annualRevenue * retentionImprovementValue * riskFactor,
      upselling: annualRevenue * upsellingRateValue * riskFactor,
      total: 0
    }
    revenueUplift.total = revenueUplift.conversion + revenueUplift.responseTime + revenueUplift.retention + revenueUplift.upselling

    // Cost Savings Calculations
    const devTimeSavings = Math.max(0, (devHoursWeek - targetDevHoursWeek) * 52 * devHourlyRate * riskFactor)
    const trainingCostReduction = Math.max(0, newHiresYear * trainingCostDay * 0.3 * riskFactor)
    const adminEfficiency = Math.max(0, annualRevenue * (adminEfficiencyRate / 100) * riskFactor)
    const errorReduction = Math.max(0, annualRevenue * (errorReductionRate / 100) * riskFactor)

    const costSavings = {
      developer: devTimeSavings,
      training: trainingCostReduction,
      admin: adminEfficiency,
      errorReduction: errorReduction,
      total: devTimeSavings + trainingCostReduction + adminEfficiency + errorReduction
    }

    // Productivity Gains
    const salesProductivity = Math.max(0, salesStaff * salesHourlyRate * 2080 * (salesProductivityRate / 100) * riskFactor)
    const matchmakerProductivity = Math.max(0, matchmakers * matchmakerHourlyRate * 2080 * (matchmakerProductivityRate / 100) * riskFactor)
    const reportingTimeSavings = Math.max(0, (salesStaff + matchmakers + 25) * adminHourlyRate * 52 * 2 * riskFactor)

    const productivityGains = {
      sales: salesProductivity,
      matchmaker: matchmakerProductivity,
      reporting: reportingTimeSavings,
      total: salesProductivity + matchmakerProductivity + reportingTimeSavings
    }

    // Check if we're at baseline (no improvements)
    const isAtBaseline = 
      targetConversionRate === currentConversionRate &&
      targetResponseTime === currentResponseTime &&
      targetDevHoursWeek === devHoursWeek &&
      targetTrainingDays === 0 &&
      retentionImprovement === 0 &&
      upsellingRate === 0 &&
      adminEfficiencyRate === 0 &&
      errorReductionRate === 0 &&
      salesProductivityRate === 0 &&
      matchmakerProductivityRate === 0

    // Calculate total benefits
    const totalBenefits = isAtBaseline ? 0 : (revenueUplift.total + costSavings.total + productivityGains.total) * implementationSuccess

    // Total Costs
    const integrationCosts = crmImplementationCost * 0.25
    const changeManagementCosts = crmImplementationCost * 0.15
    const totalImplementationCosts = crmImplementationCost + integrationCosts + changeManagementCosts
    const totalCosts = totalImplementationCosts + annualCrmLicense

    // ROI Calculation
    const roi = totalBenefits === 0 ? -100 : ((totalBenefits - totalCosts) / totalCosts) * 100
    const paybackPeriod = totalBenefits === 0 ? Infinity : totalCosts / (totalBenefits / 12)

    // 3-Year Analysis with ramp-up
    const year1Benefits = totalBenefits * 0.5
    const year2Benefits = totalBenefits * 0.85
    const year3Benefits = totalBenefits * 1.0
    
    const yearlyAnalysis = [
      { year: 'Year 1', benefits: year1Benefits, costs: totalCosts, net: year1Benefits - totalCosts },
      { year: 'Year 2', benefits: year2Benefits, costs: annualCrmLicense, net: year2Benefits - annualCrmLicense },
      { year: 'Year 3', benefits: year3Benefits, costs: annualCrmLicense, net: year3Benefits - annualCrmLicense }
    ]

    const threeYearNPV = yearlyAnalysis.reduce((npv, year, index) => {
      return npv + (year.net / Math.pow(1.1, index + 1))
    }, 0)

    return {
      totalBenefits,
      totalCosts,
      totalImplementationCosts,
      roi,
      paybackPeriod,
      threeYearNPV,
      implementationSuccess,
      breakdown: {
        revenueUplift,
        costSavings,
        productivityGains
      },
      yearlyAnalysis
    }
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
    return '#7A39ED'
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
      setAnnualRevenue(saved.annualRevenue);
      setMonthlyLeads(saved.monthlyLeads);
      setCurrentConversionRate(saved.currentConversionRate);
      setAvgCustomerValue(saved.avgCustomerValue);
      setCurrentResponseTime(saved.currentResponseTime);
      setSalesStaff(saved.salesStaff);
      setMatchmakers(saved.matchmakers);
      setDevHoursWeek(saved.devHoursWeek);
      setNewHiresYear(saved.newHiresYear);
      setCrmImplementationCost(saved.crmImplementationCost);
      setAnnualCrmLicense(saved.annualCrmLicense);
      setDevHourlyRate(saved.devHourlyRate);
      setSalesHourlyRate(saved.salesHourlyRate);
      setMatchmakerHourlyRate(saved.matchmakerHourlyRate);
      setAdminHourlyRate(saved.adminHourlyRate);
      setTrainingCostDay(saved.trainingCostDay);
      setTargetConversionRate(saved.targetConversionRate);
      setTargetResponseTime(saved.targetResponseTime);
      setTargetDevHoursWeek(saved.targetDevHoursWeek);
      setTargetTrainingDays(saved.targetTrainingDays);
    }
  };

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
            {/* IJL logo center */}
            <div className="flex-1 flex justify-center">
              <img src={ijlLogo} alt="It's Just Lunch" style={{height: '109px'}} />
            </div>
            {/* Spacer right */}
            <div style={{width: '80px'}}></div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calculator className="h-5 w-5" style={{color: '#38003C'}} />
            <h1 className="text-2xl font-bold" style={{color: '#38003C'}}>CRM Decision Assistant</h1>
          </div>
          <p className="text-base text-[#16815A] mb-0">Calculate the return on investment for upgrading to SugarCRM</p>
          <p className="text-xs text-[#ACACAC]">Updated for 2025 centralized business model with expert panel feedback</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="annualRevenue">Annual Revenue: ${(annualRevenue / 1000000).toFixed(0)}M</Label>
                    <Slider
                      id="annualRevenue"
                      min={10000000}
                      max={50000000}
                      step={1000000}
                      value={[annualRevenue]}
                      onValueChange={(value) => setAnnualRevenue(value[0])}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$10M</span>
                      <span>Centralized operations</span>
                      <span>$50M</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="monthlyLeads">Monthly Leads: {monthlyLeads}</Label>
                    <Slider
                      id="monthlyLeads"
                      min={200}
                      max={2000}
                      step={50}
                      value={[monthlyLeads]}
                      onValueChange={(value) => setMonthlyLeads(value[0])}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>200</span>
                      <span>10K annual ÷ 12 months</span>
                      <span>2,000</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="currentConversionRate">Current Conversion Rate: {currentConversionRate}%</Label>
                    <Slider
                      id="currentConversionRate"
                      min={10}
                      max={40}
                      step={1}
                      value={[currentConversionRate]}
                      onValueChange={(value) => setCurrentConversionRate(value[0])}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>10%</span>
                      <span>8K clients ÷ 10K leads</span>
                      <span>40%</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="avgCustomerValue">Average Customer Value ($)</Label>
                    <Input
                      id="avgCustomerValue"
                      type="number"
                      value={avgCustomerValue}
                      onChange={(e) => setAvgCustomerValue(Number(e.target.value))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                    <span className="text-xs text-gray-500">Research: $2.5K-$3.5K</span>
                  </div>

                  <div>
                    <Label htmlFor="currentResponseTime">Current Response Time (hours)</Label>
                    <Input
                      id="currentResponseTime"
                      type="number"
                      step="0.5"
                      value={currentResponseTime}
                      onChange={(e) => setCurrentResponseTime(Number(e.target.value))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="salesStaff">Sales Staff Count</Label>
                    <Input
                      id="salesStaff"
                      type="number"
                      value={salesStaff}
                      onChange={(e) => setSalesStaff(Number(e.target.value))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                    <span className="text-xs text-gray-500">Centralized team</span>
                  </div>

                  <div>
                    <Label htmlFor="matchmakers">Matchmaker Count</Label>
                    <Input
                      id="matchmakers"
                      type="number"
                      value={matchmakers}
                      onChange={(e) => setMatchmakers(Number(e.target.value))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                    <span className="text-xs text-gray-500">Centralized team</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expected Improvements */}
            <Card className="border-2" style={{borderColor: '#7A39ED', marginBottom: '12px'}}>
              <CardHeader className="pb-4 pt-6" style={{backgroundColor: '#7A39ED', marginTop: '-1px', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
                <CardTitle className="text-white">Expected Improvements</CardTitle>
                <CardDescription className="text-white/80">
                  Set your target improvement metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="targetConversionRate" className="flex items-center gap-2">
                      Conversion Rate: {currentConversionRate}% → {targetConversionRate}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected 10-15% conversion rate improvement through structured follow-ups and better lead management</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="targetConversionRate"
                      min={currentConversionRate}
                      max={40}
                      step={0.5}
                      value={[targetConversionRate]}
                      onValueChange={(value) => setTargetConversionRate(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetResponseTime" className="flex items-center gap-2">
                      Response Time: {currentResponseTime} → {targetResponseTime} hours
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Target 50% reduction in response time to boost close rates and improve client experience</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="targetResponseTime"
                      min={1}
                      max={currentResponseTime}
                      step={0.5}
                      value={[targetResponseTime]}
                      onValueChange={(value) => setTargetResponseTime(value[0])}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentRetentionRate" className="flex items-center gap-2">
                      Current Retention Rate: {currentRetentionRate}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current client retention rate before CRM improvements</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="currentRetentionRate"
                      min={50}
                      max={95}
                      step={1}
                      value={[currentRetentionRate]}
                      onValueChange={(value) => setCurrentRetentionRate(value[0])}
                      className="mt-2"
                    />
                    <Label htmlFor="retentionImprovement" className="mt-4 flex items-center gap-2">
                      Target Retention Rate: {currentRetentionRate + retentionImprovement}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected retention improvement through better client tracking and follow-up</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="retentionImprovement"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[retentionImprovement]}
                      onValueChange={([value]) => setRetentionImprovement(value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentUpsellingRate" className="flex items-center gap-2">
                      Current Upselling Rate: {currentUpsellingRate}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current rate of upgrading clients to premium tiers</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="currentUpsellingRate"
                      min={0}
                      max={20}
                      step={0.5}
                      value={[currentUpsellingRate]}
                      onValueChange={(value) => setCurrentUpsellingRate(value[0])}
                      className="mt-2"
                    />
                    <Label htmlFor="upsellingRate" className="mt-4 flex items-center gap-2">
                      Target Upselling Rate: {currentUpsellingRate + upsellingRate}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected improvement in premium tier upgrades through better client insights</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="upsellingRate"
                      min={0}
                      max={20}
                      step={0.1}
                      value={[upsellingRate]}
                      onValueChange={([value]) => setUpsellingRate(value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentAdminEfficiency" className="flex items-center gap-2">
                      Current Admin Efficiency: {currentAdminEfficiency}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current administrative efficiency before workflow automation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="currentAdminEfficiency"
                      min={50}
                      max={90}
                      step={1}
                      value={[currentAdminEfficiency]}
                      onValueChange={(value) => setCurrentAdminEfficiency(value[0])}
                      className="mt-2"
                    />
                    <Label htmlFor="adminEfficiencyRate" className="mt-4 flex items-center gap-2">
                      Target Admin Efficiency: {currentAdminEfficiency + adminEfficiencyRate}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected 5-8 hours/week saved per rep/matchmaker through workflow automation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="adminEfficiencyRate"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[adminEfficiencyRate]}
                      onValueChange={([value]) => setAdminEfficiencyRate(value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentErrorRate" className="flex items-center gap-2">
                      Current Error Rate: {currentErrorRate}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current rate of manual errors in lead routing and matchmaking</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="currentErrorRate"
                      min={0}
                      max={10}
                      step={0.1}
                      value={[currentErrorRate]}
                      onValueChange={(value) => setCurrentErrorRate(value[0])}
                      className="mt-2"
                    />
                    <Label htmlFor="errorReductionRate" className="mt-4 flex items-center gap-2">
                      Target Error Rate: {Math.max(0, currentErrorRate - errorReductionRate)}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected reduction in errors through automated workflows and better visibility</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="errorReductionRate"
                      min={0}
                      max={currentErrorRate}
                      step={0.1}
                      value={[errorReductionRate]}
                      onValueChange={([value]) => setErrorReductionRate(value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentSalesProductivity" className="flex items-center gap-2">
                      Current Sales Productivity: {currentSalesProductivity}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current sales team productivity before CRM improvements</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="currentSalesProductivity"
                      min={50}
                      max={90}
                      step={1}
                      value={[currentSalesProductivity]}
                      onValueChange={(value) => setCurrentSalesProductivity(value[0])}
                      className="mt-2"
                    />
                    <Label htmlFor="salesProductivityRate" className="mt-4 flex items-center gap-2">
                      Target Sales Productivity: {currentSalesProductivity + salesProductivityRate}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected productivity gains through better lead management and automated workflows</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="salesProductivityRate"
                      min={0}
                      max={30}
                      step={0.1}
                      value={[salesProductivityRate]}
                      onValueChange={([value]) => setSalesProductivityRate(value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentMatchmakerProductivity" className="flex items-center gap-2">
                      Current Matchmaker Productivity: {currentMatchmakerProductivity}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current matchmaker productivity before CRM improvements</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="currentMatchmakerProductivity"
                      min={50}
                      max={90}
                      step={1}
                      value={[currentMatchmakerProductivity]}
                      onValueChange={(value) => setCurrentMatchmakerProductivity(value[0])}
                      className="mt-2"
                    />
                    <Label htmlFor="matchmakerProductivityRate" className="mt-4 flex items-center gap-2">
                      Target Matchmaker Productivity: {currentMatchmakerProductivity + matchmakerProductivityRate}%
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected productivity gains through better client matching and automated workflows</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Slider
                      id="matchmakerProductivityRate"
                      min={0}
                      max={30}
                      step={0.1}
                      value={[matchmakerProductivityRate]}
                      onValueChange={([value]) => setMatchmakerProductivityRate(value)}
                      className="mt-2"
                    />
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
                    <Label htmlFor="implementationType">Implementation Type</Label>
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

                  <div>
                    <Label htmlFor="crmImplementationCost">Initial Implementation Cost ($)</Label>
                    <Input
                      id="crmImplementationCost"
                      type="number"
                      value={crmImplementationCost}
                      onChange={(e) => setCrmImplementationCost(Number(e.target.value))}
                      className="border-[#04DFC6] focus:border-[#04DFC6]"
                    />
                    <p className="text-sm text-[#ACACAC] mt-1">
                      {implementationType === 'sugarcrm' 
                        ? 'Estimated: $125k-$200k' 
                        : 'Estimated: $150k'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="annualCrmLicense">Annual License/Maintenance ($)</Label>
                    <Input
                      id="annualCrmLicense"
                      type="number"
                      value={annualCrmLicense}
                      onChange={(e) => setAnnualCrmLicense(Number(e.target.value))}
                      className="border-[#04DFC6] focus:border-[#04DFC6]"
                    />
                    <p className="text-sm text-[#ACACAC] mt-1">
                      {implementationType === 'sugarcrm' 
                        ? 'Estimated: $25k-$50k/year' 
                        : 'Estimated: $75k-$100k/year (internal team)'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="implementationTimeline">Implementation Timeline (months)</Label>
                    <Input
                      id="implementationTimeline"
                      type="number"
                      value={implementationTimeline}
                      onChange={(e) => setImplementationTimeline(Number(e.target.value))}
                      className="border-[#04DFC6] focus:border-[#04DFC6]"
                    />
                    <p className="text-sm text-[#ACACAC] mt-1">
                      {implementationType === 'sugarcrm' 
                        ? 'Estimated: 3-6 months' 
                        : 'Estimated: 9-15 months'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="devHourlyRate">Developer Hourly Rate ($)</Label>
                    <Input
                      id="devHourlyRate"
                      type="number"
                      value={devHourlyRate}
                      onChange={(e) => setDevHourlyRate(Number(e.target.value))}
                      className="border-[#04DFC6] focus:border-[#04DFC6]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="salesHourlyRate">Sales Hourly Rate ($)</Label>
                    <Input
                      id="salesHourlyRate"
                      type="number"
                      value={salesHourlyRate}
                      onChange={(e) => setSalesHourlyRate(Number(e.target.value))}
                      className="border-[#04DFC6] focus:border-[#04DFC6]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="matchmakerHourlyRate">Matchmaker Hourly Rate ($)</Label>
                    <Input
                      id="matchmakerHourlyRate"
                      type="number"
                      value={matchmakerHourlyRate}
                      onChange={(e) => setMatchmakerHourlyRate(Number(e.target.value))}
                      className="border-[#04DFC6] focus:border-[#04DFC6]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="adminHourlyRate">Admin Hourly Rate ($)</Label>
                    <Input
                      id="adminHourlyRate"
                      type="number"
                      value={adminHourlyRate}
                      onChange={(e) => setAdminHourlyRate(Number(e.target.value))}
                      className="border-[#04DFC6] focus:border-[#04DFC6]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="trainingCostDay">Training Cost per Day ($)</Label>
                    <Input
                      id="trainingCostDay"
                      type="number"
                      value={trainingCostDay}
                      onChange={(e) => setTrainingCostDay(Number(e.target.value))}
                      className="border-[#04DFC6] focus:border-[#04DFC6]"
                    />
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
                  Key ROI metrics and breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-white font-semibold">Total Annual Benefits</div>
                    <div className="text-xl font-semibold" style={{color: '#3DF08A'}}>${formatCurrency(results.totalBenefits)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white font-semibold">Total Annual Costs</div>
                    <div className="text-xl font-semibold" style={{color: '#B39BFF'}}>${formatCurrency(results.totalCosts)}</div>
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
                            { name: 'Revenue', value: results.breakdown.revenueUplift.total, color: '#7A39ED' },
                            { name: 'Cost Savings', value: results.breakdown.costSavings.total, color: '#04DFC6' },
                            { name: 'Productivity', value: results.breakdown.productivityGains.total, color: '#B2F000' }
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
                            {results.breakdown.revenueUplift.total > 0 && (
                              <Cell fill="#7A39ED" />
                            )}
                            {results.breakdown.costSavings.total > 0 && (
                              <Cell fill="#04DFC6" />
                            )}
                            {results.breakdown.productivityGains.total > 0 && (
                              <Cell fill="#B2F000" />
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