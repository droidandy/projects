import React, {Fragment, useState} from "react";

import {
    Section,
    ContainerFilledButton,
    ContainerSwithButton,
    CalcContainer,
    CalcBlock,
    CalcBlockResult,
    BlockTitle,
    BlockLine,
    ContainerPadding,
    CalcStatusTitle,
    ResultsTitle,
    ResultsText,
    TaxTitle,
    TaxResult,
    ContainerButton,
    ButtonIncome,
    ButtonBusiness,
    ButtonSales,
    Gap,
    CalcBlockResultWrapper
} from "./styles";

//Components
import TitleWithSubtitle from "../../../../components/texts/title_with_subtitle";
import CalcStatus from "./calc_status";
import CalcInput from "./calc_input";
import FilledButton from "../../../../components/buttons/filled_button";
import SwitchCalcButton from "../../../../components/buttons/switch_calc_button";

//images
import SingleImage from "./s_image";
import MfjImage from "./mfj_image";
import MfsImage from "./mfs_image";
import HhImage from "./hh_image";
import QwImage from "./qw_image";

import calc from "./calc_logic";
import calcBusiness from "./calc_business_logic";
import calcSales from "./calc_sales_logic";
import Helmet from "react-helmet";

function CalculatorSection(props) {

    const filingStatuses = [
        {
            id: "s",
            status: "Single",
            image: <SingleImage/>,
            hintText: "If on the last day of the year, you are unmarried or legally separated from your spouse under a divorce or separate maintenance decree and you do not qualify for another filing status."
        },
        {
            id: "mfj",
            status: "Married, Filing jointly",
            image: <MfjImage/>,
            hintText: "You are married and both you and your spouse agree to file a joint return. (On a joint return, you report your combined income and deduct your combined allowable expenses.)"
        },
        {
            id: "mfs",
            status: "Married, Filing separately",
            image: <MfsImage/>,
            hintText: "You must be married. This method may benefit you if you want to be responsible only for your own tax or if this method results in less tax than a joint return. If you and your spouse do not agree to file a joint return, you may have to use this filing status."
        },
        {
            id: "hh",
            status: "Head of Household",
            image: <HhImage/>,
            hintText: "You must meet the following requirements: 1. You are unmarried or considered unmarried on the last day of the year. 2. You paid more than half the cost of keeping up a home for the year. 3. A qualifying person lived with you in the home for more than half the year (except temporary absences, such as school). However, your dependent parent does not have to live with you."
        },
        {
            id: "qw",
            status: "Qualifying widow(er)",
            image: <QwImage/>,
            hintText: "If your spouse died in 2019, you can use married filing jointly as your filing status for 2019 if you otherwise qualify to use that status. The year of death is the last year for which you can file jointly with your deceased spouse. You may be eligible to use qualifying widow(er) with dependent child as your filing status for two years following the year of death of your spouse."
        }
    ];

    const filingBusinessStatuses = [
        {
            id: "s",
            status: "Single",
        },
        {
            id: "mfj",
            status: "Married, Filing jointly",
        },
        {
            id: "mfs",
            status: "Married, Filing separately",
        },
        {
            id: "hh",
            status: "Head of Household",
        },
        {
            id: "qw",
            status: "Qualifying widow(er)",
        }
    ];

    const entityTypes = [
        {
            id: "c",
            status: "C-Corporation",
        },
        {
            id: "s",
            status: "S-Corporation",
        },
        {
            id: "sm",
            status: "LLC - Single Member",
        },
        {
            id: "cc",
            status: "LLC - C-Corp",
        },
        {
            id: "sc",
            status: "LLC - S-Corp",
        },
        {
            id: "p",
            status: "LLC - Partnership",
        }
    ];


    let [currentFilingStatus, setStatus] = useState("");
    let [currentEntityType, setCurrentEntityType] = useState("C-Corporation");
    let [currentBusinessFilingStatus, setCurrentBusinessFilingStatus] = useState("s");
    let [childDepNum, setChildDepNum] = useState(0);
    let [nonChildDepNum, setNonChildDepNum] = useState(0);
    let [w2Income, setW2Income] = useState(0);
    let [w2SpousalIncome, setW2SpousalIncome] = useState(0);
    let [w2Withholding, setW2Withholding] = useState(0);
    let [sEIncome, setSEIncome] = useState(0);
    let [spousalSEIncome, setSpousalSEIncome] = useState(0);
    let [unemploymentIncome, setUnemploymentIncome] = useState(0);
    let [spousalUnemploymentIncome, setSpousalUnemploymentIncome] = useState(0);
    let [mortgageInterest, setMortgageInterest] = useState(0);
    let [charitableContributions, setCharitableContributions] = useState(0);
    let [medicalExpenses, setMedicalExpenses] = useState(0);
    let [dependentCareExpenses, setDependentCareExpenses] = useState(0);
    let [studentLoanInterest, setStudentLoanInterest] = useState(0);
    let [calcViewType, setCalcViewType] = useState("income");

    console.log(calcViewType);
    console.log('myyyyy loooooog', currentEntityType);

    //Sales calculator
    let [zipCode, setZipCode] = useState(0);
    let [sales, setSales] = useState(0);

    //business calculator
    let [revenue, setRevenue] = useState(0);
    let [totalExpenses, setTotalExpenses] = useState(0);
    let [meExpenses, setMeExpenses] = useState(0);
    let [estimatedTaxPayments, setEstimatedTaxPayments] = useState(0);

    const [taxLiability, setTaxLiability] = useState(0);
    const [liabilityPayable, setLiabilityPayable] = useState(0);

    const [businessTaxLiability, setBusinessTaxLiability] = useState(0);

    const [salesTaxTotal, setSalesTaxTotal] = useState(0);
    const [rate, setRate] = useState('0.0%');

    function setFilingStatus(status) {
        setStatus(status);
    }

    function onChangeChildDepNum(e) {
        setChildDepNum(e.target.value);
    }

    function onChangeNonChildDepNum(e) {
        setNonChildDepNum(e.target.value);
    }

    function onChangeW2Income(e) {
        setW2Income(e.target.value);
    }

    function onChangeW2SpousalIncome(e) {
        setW2SpousalIncome(e.target.value);
    }

    function onChangeW2Withholding(e) {
        setW2Withholding(e.target.value);
    }

    function onChangeSEIncome(e) {
        setSEIncome(e.target.value);
    }

    function onChangeSpousalSEIncome(e) {
        setSpousalSEIncome(e.target.value);
    }

    function onChangeUnemploymentIncome(e) {
        setUnemploymentIncome(e.target.value);
    }

    function onChangeSpousalUnemploymentIncome(e) {
        setSpousalUnemploymentIncome(e.target.value);
    }

    function onChangeMortgageInterest(e) {
        setMortgageInterest(e.target.value);
    }

    function onChangeCharitableContributions(e) {
        setCharitableContributions(e.target.value);
        //console.log(e.target.value)
    }

    function onChangeMedicalExpenses(e) {
        setMedicalExpenses(e.target.value);
    }

    function onChangeDependentCareExpenses(e) {
        setDependentCareExpenses(e.target.value);
    }

    function onChangeStudentLoanInterest(e) {
        setStudentLoanInterest(e.target.value);
    }

    function onChangeZipCode(e) {
        setZipCode(e.target.value);
    }

    function onChangeSales(e) {
        setSales(e.target.value);
    }

    function onChangeRevenue(e) {
        setRevenue(e.target.value);
    }

    function onChangeTotalExpenses(e) {
        setTotalExpenses(e.target.value);
    }

    function onChangeMeExpenses(e) {
        setMeExpenses(e.target.value);
    }

    function onChangeEstimatedTaxPayments(e) {
        setEstimatedTaxPayments(e.target.value);
    }

    function calcTaxes() {
        const values = {
            filingStatus: currentFilingStatus,
            incomes: {
                w2: w2Income,
                spouseW2: w2SpousalIncome,
                w2Withholding: w2Withholding,
                selfEmployment: sEIncome,
                spouseSE: spousalSEIncome,
                unemployment: unemploymentIncome,
                spouseUnemp: spousalUnemploymentIncome
            },
            deductions: {
                mortgageInterest: mortgageInterest,
                medicalExpenses: medicalExpenses,
                studentLoanInterest: studentLoanInterest,
                charitableContributions: charitableContributions,
                careExpenses: dependentCareExpenses,
                quarterlyEstimatedPayments: 0
            },
            childDependents: childDepNum,
            nonChildDependents: nonChildDepNum
        };
        //console.log(values)
        const {tl, lp} = calc(values);
        setTaxLiability(tl);
        setLiabilityPayable(lp);
    }

    function calcBusinessTaxes() {
        const values = {
            entityType: currentEntityType,
            filingStatus: currentBusinessFilingStatus,
            revenue,
            expenses: totalExpenses,
            entertainment: meExpenses,
            estimatedPayments: estimatedTaxPayments
        };

        const l = calcBusiness(values);

        setBusinessTaxLiability(l);
    }

    function calcSalesTaxes() {
        const result = calcSales({zipCode, sales});

        setSalesTaxTotal(result.z);
        setRate(result.percentage);
    }

    const incomeCalc = <CalcContainer>
        <CalcBlock>
            <BlockTitle>Filing Status and Dependents</BlockTitle>
            <BlockLine/>
            <ContainerPadding>
                <CalcStatusTitle>Filing Status</CalcStatusTitle>
                {filingStatuses.map(filingStatus => (
                    <CalcStatus
                        isImageVisible={true}
                        isHintVisible={true}
                        isActive={
                            filingStatus.id == currentFilingStatus
                                ? "yes"
                                : "no"
                        }
                        isHintActive={filingStatus.isHintActive}
                        key={filingStatus.id}
                        id={filingStatus.id}
                        hintText={filingStatus.hintText}
                        status={filingStatus.status}
                        image={filingStatus.image}
                        setFilingStatus={() =>
                            setFilingStatus(filingStatus.id)
                        }
                    />
                ))}
            </ContainerPadding>
            <BlockLine/>
            <ContainerPadding>
                <Gap/>
                <CalcInput
                    title="Number of Child Dependents (10 max)"
                    hint="The Child Tax Credit is a tax credit worth up to $2,000 per qualifying child and is one of the most effective federal tax credits that reduce your tax bill."
                    setInputValue={onChangeChildDepNum}
                    inputValue={childDepNum}
                />
                <CalcInput
                    title="Number of Non-Child Dependents (10 max)"
                    hint="The Child Tax Credit is a tax credit worth up to $500 per qualifying dependent and is one of the most effective federal tax credits that reduce your tax bill."
                    setInputValue={onChangeNonChildDepNum}
                    inputValue={nonChildDepNum}
                />
            </ContainerPadding>
        </CalcBlock>
        <CalcBlock>
            <BlockTitle>Income</BlockTitle>
            <BlockLine/>
            <ContainerPadding>
                <Gap/>
                <CalcInput
                    title="W-2 Income"
                    hint="If you received one or more W-2 forms, please enter your total amount from box 1 here."
                    setInputValue={onChangeW2Income}
                    inputValue={w2Income}
                />
                {currentFilingStatus === "mfj" ? (
                    <CalcInput
                        title="Spousal W-2 Income"
                        hint="If your spouse received one or more W-2 forms, please enter the total amount from box 1 here."
                        setInputValue={onChangeW2SpousalIncome}
                        inputValue={w2SpousalIncome}
                    />
                ) : null}
                <CalcInput
                    title="W-2 Withholding"
                    hint="If you received one or more W-2 forms, please enter your total amount from box 2 here. If your are filing as Married Filing Jointly, please add up your spouse’s W-2 withholding here as well."
                    setInputValue={onChangeW2Withholding}
                    inputValue={w2Withholding}
                />
                <CalcInput
                    title="Self-Employment Income"
                    hint="If you have a net income as a self-employed, please enter the amount here."
                    setInputValue={onChangeSEIncome}
                    inputValue={sEIncome}
                />
                {currentFilingStatus === "mfj" ? (
                    <CalcInput
                        title="Spousal Self-Employment Income"
                        hint="If your spouse has a net income as a self-employed, please enter the amount here."
                        setInputValue={onChangeSpousalSEIncome}
                        inputValue={spousalSEIncome}
                    />
                ) : null}
                <CalcInput
                    title="Unemployment Income"
                    hint="If received unemployment income, please enter the amount here."
                    setInputValue={onChangeUnemploymentIncome}
                    inputValue={unemploymentIncome}
                />
                {currentFilingStatus === "mfj" ? (
                    <CalcInput
                        title="Spousal Unemployment Income"
                        hint="If your spouse received unemployment income, please enter the amount here."
                        setInputValue={
                            onChangeSpousalUnemploymentIncome
                        }
                        inputValue={spousalUnemploymentIncome}
                    />
                ) : null}
            </ContainerPadding>
        </CalcBlock>
        <CalcBlock>
            <BlockTitle>Deductions & Credits</BlockTitle>
            <BlockLine/>
            <ContainerPadding>
                <Gap/>
                <CalcInput
                    title="Mortgage Interest"
                    hint="If you have expenses that were used to pay your mortgage interest and qualify under the new changes by the Tax Cuts and Jobs Act, please enter the amount here."
                    setInputValue={onChangeMortgageInterest}
                    inputValue={mortgageInterest}
                />
                <CalcInput
                    title="Charitable Contributions"
                    hint="US taxpayers can now deduct up to 60% from their AGI on qualifying charitable contributions. If you made such payments, please enter the amount here."
                    setInputValue={onChangeCharitableContributions}
                    inputValue={charitableContributions}
                />
                <CalcInput
                    title="Medical Expenses"
                    hint="You can deduct medical expenses that exceed 7.5% from your AGI. If you have qualifying expenses, please enter the amount here."
                    setInputValue={onChangeMedicalExpenses}
                    inputValue={medicalExpenses}
                />
                <CalcInput
                    title="Child and Dependent Care Expenses"
                    hint="If applicable, pease enter qualifying child and dependent care expenses that can be used to deduct your taxes."
                    setInputValue={onChangeDependentCareExpenses}
                    inputValue={dependentCareExpenses}
                />
                <CalcInput
                    title="Student Loan Interest"
                    hint="If you have payments that were used to pay your student loan interest and qualify under the new changes by the Tax Cuts and Jobs Act, please enter the amount here."
                    setInputValue={onChangeStudentLoanInterest}
                    inputValue={studentLoanInterest}
                />
            </ContainerPadding>
        </CalcBlock>
        <CalcBlockResultWrapper>
            <CalcBlockResult>
                <BlockTitle>Results</BlockTitle>
                <BlockLine/>
                <ContainerPadding>
                    <TaxTitle>Tax Liability</TaxTitle>
                    <TaxResult>${taxLiability.toFixed(2)}</TaxResult>
                    <TaxTitle>
                        {liabilityPayable >= 0
                            ? "Liability Payable"
                            : "Refund Due"}
                    </TaxTitle>
                    <TaxResult>
                        ${Math.abs(liabilityPayable).toFixed(2)}
                    </TaxResult>
                    <ContainerFilledButton>
                        <FilledButton
                            text="Calculate My Taxes"
                            onClick={calcTaxes}
                        />
                    </ContainerFilledButton>
                </ContainerPadding>
                {/*<BlockLine/>*/}
                {/*<ResultsTitle>Using Standard Deduction</ResultsTitle>*/}
                {/*<ResultsText>*/}
                {/*    Based on your inputs, using the standard deduction will*/}
                {/*    yield the greatest tax benefit.*/}
                {/*</ResultsText>*/}
            </CalcBlockResult>
        </CalcBlockResultWrapper>

    </CalcContainer>

    const businessCalc = <CalcContainer>
        <CalcBlock>
            <BlockTitle>Small Business Tax Calculator</BlockTitle>
            <BlockLine/>
            <ContainerPadding>
                <CalcStatusTitle>Entity Type</CalcStatusTitle>
                {entityTypes.map(entityType => (
                    <CalcStatus
                        isImageVisible={false}
                        isHintVisible={false}
                        isActive={
                            entityType.status == currentEntityType
                                ? "yes"
                                : "no"
                        }
                        isHintActive={entityType.isHintActive}
                        key={entityType.id}
                        id={entityType.id}
                        hintText={entityType.hintText}
                        status={entityType.status}
                        setFilingStatus={() =>
                            setCurrentEntityType(entityType.status)
                        }
                    />
                ))}
            </ContainerPadding>
        </CalcBlock>
        {console.log("cheeeeeeeeeckkkkkk", currentEntityType, currentEntityType === "LLC - C-Corp")}
        {
            ("C-Corporation" === currentEntityType || "LLC - C-Corp" === currentEntityType) &&
            <CalcBlock>
                <BlockTitle>Filing Status</BlockTitle>
                <BlockLine/>
                <ContainerPadding>
                    <Gap/>
                    {filingBusinessStatuses.map(filingBusinessStatus => (
                        <CalcStatus
                            isImageVisible={false}
                            isHintVisible={false}
                            isActive={
                                filingBusinessStatus.id == currentBusinessFilingStatus
                                    ? "yes"
                                    : "no"
                            }
                            isHintActive={filingBusinessStatus.isHintActive}
                            key={filingBusinessStatus.id}
                            id={filingBusinessStatus.id}
                            hintText={filingBusinessStatus.hintText}
                            status={filingBusinessStatus.status}
                            setFilingStatus={() =>
                                setCurrentBusinessFilingStatus(filingBusinessStatus.id)
                            }
                        />
                    ))}
                </ContainerPadding>
            </CalcBlock>
        }

        <CalcBlock>
            <BlockTitle>Financials</BlockTitle>
            <BlockLine/>
            <ContainerPadding>
                <Gap/>
                <CalcInput
                    title="Revenue"
                    hint="This is your total income from selling goods or services to your customers."
                    setInputValue={onChangeRevenue}
                    inputValue={revenue}
                />
                <CalcInput
                    title="Total expenses"
                    hint="​​These are the cost of carrying on a business, if it operates to make a profit."
                    setInputValue={onChangeTotalExpenses}
                    inputValue={totalExpenses}
                />
                <CalcInput
                    title="Meals & Entertainment Expenses"
                    hint="​​These expenses qualify only for a 50% deduction and relate to the expanses you used when interacting with a client or operating your business."
                    setInputValue={onChangeMeExpenses}
                    inputValue={meExpenses}
                />
                <CalcInput
                    title="Estimated Tax Payments"
                    hint="​​If you have already made a pre-payment to the IRS for this year’s taxes, please enter the amount here. "
                    setInputValue={onChangeEstimatedTaxPayments}
                    inputValue={estimatedTaxPayments}
                />
            </ContainerPadding>
        </CalcBlock>
        <CalcBlockResultWrapper>
            <CalcBlockResult>
                <BlockTitle>Results</BlockTitle>
                <BlockLine/>
                <ContainerPadding>
                    <TaxTitle>Tax Liability</TaxTitle>
                    <TaxResult
                        color="red">${businessTaxLiability > 0 ? businessTaxLiability.toFixed(2) : 0.00}</TaxResult>
                    <TaxTitle>Tax Refund</TaxTitle>
                    <TaxResult
                        color="green">${businessTaxLiability < 0 ? -businessTaxLiability.toFixed(2) : 0.00}</TaxResult>
                    <ContainerFilledButton>
                        <FilledButton
                            text="Calculate My Taxes"
                            onClick={calcBusinessTaxes}
                        />
                    </ContainerFilledButton>
                </ContainerPadding>
            </CalcBlockResult>
        </CalcBlockResultWrapper>

    </CalcContainer>

    const salesCalc = <CalcContainer>
        <CalcBlock>
            <BlockTitle>Sales Tax Calculator</BlockTitle>
            <BlockLine/>
            <Gap/>
            <ContainerPadding>
                <CalcInput
                    title="ZIP Code"
                    hint="​​Enter the location you sold your products from."
                    setInputValue={onChangeZipCode}
                    inputValue={zipCode}
                />
            </ContainerPadding>
            <ContainerPadding>
                <CalcInput
                    title="Sales, $"
                    hint="​​Total amount of goods sold within the selected area."
                    setInputValue={onChangeSales}
                    inputValue={sales}
                />
            </ContainerPadding>
        </CalcBlock>
        <CalcBlockResultWrapper>
            <CalcBlockResult>
                <BlockTitle>Results</BlockTitle>
                <BlockLine/>
                <ContainerPadding>
                    <TaxTitle>Sales Tax Total</TaxTitle>
                    <TaxResult>${salesTaxTotal}</TaxResult>
                    <TaxTitle>Rate</TaxTitle>
                    <TaxResult>{rate}</TaxResult>
                    <ContainerFilledButton>
                        <FilledButton
                            text="Calculate My Taxes"
                            onClick={calcSalesTaxes}
                        />
                    </ContainerFilledButton>
                </ContainerPadding>
            </CalcBlockResult>
        </CalcBlockResultWrapper>
    </CalcContainer>

    function switchCalcView(calcViewType) {
        console.log("inside switch", calcViewType)
        switch (calcViewType) {
//income calculator
            case "income":
                return incomeCalc;
                break;
//sales calculator
            case "sales":
                return salesCalc;
                break;
//business calculator
            case "business":
                return businessCalc;
                break;
            default:
                return incomeCalc;
                break;
        }
    }

    const el = document.querySelector("meta[name='description']");
    el.setAttribute('content', 'Our income tax calculator is a simple tool designed to help you estimate your refund and/or plan for the upcoming tax payment, including the changes from the tax reform.');

    return (
        <Fragment>
            <Helmet>
                <title>{"TaxGig Inc. - Estimate your 2021 tax refund or liability"}</title>
            </Helmet>
            <Section>
                <TitleWithSubtitle
                    title="Estimate your 2021 tax refund or liability"
                    subtitle="Our income tax calculator is a simple tool designed to help you estimate your refund and/or plan for the upcoming tax payment, including the changes from the tax reform."
                />
                <ContainerSwithButton>
                    <ContainerButton>
                        <ButtonIncome onClick={() => setCalcViewType("income")} calcViewType={calcViewType}>Income
                            Tax</ButtonIncome>
                        <ButtonBusiness onClick={() => setCalcViewType("business")} calcViewType={calcViewType}>Small
                            Business Tax</ButtonBusiness>
                        <ButtonSales onClick={() => setCalcViewType("sales")} calcViewType={calcViewType}>Sales
                            Tax</ButtonSales>
                    </ContainerButton>
                </ContainerSwithButton>
                {switchCalcView(calcViewType)}
            </Section>
        </Fragment>

    );
}

//${Math.abs(Math.round(liabilityPayable))}
export default CalculatorSection;


