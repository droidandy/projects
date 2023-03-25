export default function calc(e) {
        var totalIncome=0, // total income = t
        n=0, // EIC tax credit
        r=0, // income without medicare/social secutity (agi)
        i=0,
        s=0, //taxes need to be payed by one side
        c=0, //deductions
        l=0, //federal standard deduction
        u=0,
        f=0;
        e.childDependents=parseInt(e.childDependents),
        e.nonChildDependents=parseInt(e.nonChildDependents);
        // e.incomes.forEach(function(t) {
        //     e.incomes[t]=parseFloat(e.incomes[t]>0?e.incomes[t]: 0)
        // }
        // ),
        // e.deductions.forEach(function(t) {
        //      e.deductions[t]=parseFloat(e.deductions[t]>0?e.deductions[t]: 0)
        //     }
        // );
        var income=parseFloat(e.incomes.w2), //income = h
        incomeSpouse=parseFloat(e.incomes.spouseW2), //incomeSpouse = d
        withholding=parseFloat(e.incomes.w2Withholding), // withholding = p
        incomeSE=parseFloat(e.incomes.selfEmployment), // incomeSE = m
        incomeSpouseSE=parseFloat(e.incomes.spouseSE), // incomeSpouseSE = g
        incomeUnemployment=parseFloat(e.incomes.unemployment), // incomeUnemployment= y
        incomeSpouseUnemployment=parseFloat(e.incomes.spouseUnemp), // incomeSpouseUnemployment = b
        
        studentLoanInterest=parseFloat(e.deductions.studentLoanInterest),
        medicalExpenses=parseFloat(e.deductions.medicalExpenses),
        charitableContributions=parseFloat(e.deductions.charitableContributions),
        mortgageInterest=parseFloat(e.deductions.mortgageInterest),
        careExpenses=parseFloat(e.deductions.careExpenses),
        v=0,
        A=0,
        w=0, 
        E=0;

        if(income>0||incomeSpouse>0||incomeUnemployment>0||incomeSpouseUnemployment>0||incomeSE>0||incomeSpouseSE>0) {

            // LOADS TAX BRACKETS
            // var x=this.tables.find(function(t) {
            //     return t.value===e.filingStatus
            // }
            // );
            // var x = {
            //     from: [0, 9700, 39475, 84200, 160725, 204100, 510300],
            //     rates: [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],
            //     cumulative: [0, 970, 4543, 14382.5, 32748.5, 46628.5, 159922.5]
            // }

            // var x = {
            //         from: [0, 9700, 39475, 84200, 160725, 204100, 510300], rates: [.1, .12, .22, .24, .32, .35, .37], cumulative: [0, 970, 4543, 14382.5, 32748.5, 46628.5, 153798.5]           
            // }

            var x;
            switch(e.filingStatus) {
                case "s" : x={from: [0, 9700, 39475, 84200, 160725, 204100, 510300], rates: [.1, .12, .22, .24, .32, .35, .37], cumulative: [0, 970, 4543, 14382.5, 32748.5, 46628.5, 153798.5]};
                break;
                case "mfj" : x={from: [0, 19400, 78950, 168400, 321450, 408200, 612350], rates: [.1, .12, .22, .24, .32, .35, .37], cumulative: [0, 1940, 9086, 28765, 65497, 93257, 164709.5]};
                break;
                case "mfs" : x={from: [0, 9700, 39475, 84200, 160725, 204100, 306750], rates: [.1, .12, .22, .24, .32, .35, .37], cumulative: [0, 970, 4543, 14382.5, 32748.5, 46628.5, 82556]};
                break;
                case "hh" : x={from: [0, 13850, 52850, 84200, 160700, 204100, 510300], rates: [.1, .12, .22, .24, .32, .35, .37], cumulative: [0, 1385, 6065, 12962, 31322, 45210, 152380]};
                break;
                case"qw" : x={from: [0, 19400, 78950, 168400, 321450, 408200, 612350], rates: [.1, .12, .22, .24, .32, .35, .37], cumulative: [0, 1940, 9086, 28765, 65497, 93257, 164709.5]} 
            }

            totalIncome=income+incomeSpouse+incomeUnemployment+incomeSpouseUnemployment+incomeSE+incomeSpouseSE;

            var surtaxOver="mfj"===e.filingStatus?25e4:"mfs"===e.filingStatus?125e3:2e5; //surtaxOver = M
            if(incomeSE>0||incomeSpouseSE>0) { //if somebody is selfemployed
                var pureIncomeSE=0.9235*(incomeSE+incomeSpouseSE), // pureIncomeSE = S
                incomeWithoutSE=totalIncome-incomeSE-incomeSpouseSE; // incomeWithoutSE = I
                s+=(A=(incomeWithoutSE<132900?.124*(pureIncomeSE>132900-incomeWithoutSE?132900-incomeWithoutSE: pureIncomeSE): 0)+.029*pureIncomeSE)/2
            }

            if(studentLoanInterest>0&&"mfs"!==e.filingStatus) { //if has student loan and live no separately
                var k=totalIncome-s; //pure income without taxes
                var N="mfj"===e.filingStatus?135e3: 65e3; 
				var T=k>N?(k-N/("mfj"===e.filingStatus?3e4: 15e3)).toPrecision(3): 0; //
				
                T=T>1?1: T
				s+=(studentLoanInterest>2500)?2500-2500*T: studentLoanInterest-studentLoanInterest*T
            }

            if(((w=.009*(totalIncome>surtaxOver?totalIncome-surtaxOver:0)), (r=(r=totalIncome-s)>0 ? r : 0), medicalExpenses>0)) {
                var C=.075*r; //
                c+=medicalExpenses>C?medicalExpenses-C: 0 //deductions
            } //????

            if(mortgageInterest>0) { //didn`t find explanation
                var D="mfs"===e.filingStatus?18750: 37500; // 5% from debt
                c+=mortgageInterest>D?D: mortgageInterest //deductions
            }

            if(charitableContributions>0) {
                var O=.6*r; 
                c+= charitableContributions > O ? O : charitableContributions //deductions
            }

            switch(e.filingStatus) {
                case"s": case"mfs": l=12e3; //federal standard deduction
                break;
                case"hh": l=18e3; //federal standard deduction
                break;
                case"mfj": case"qw": l=24e3 //federal standard deduction 
            }
            c=l>=c?l:c, //total itemised deduction
            i=r-c, // agi - total itemised deduction = taxable agi
            i=i>0?i:0, 
            f=x.from.findIndex(function(e) {
                return e>i
            }
            )-1, //tax brakets ???
            f=f<0?6:f,
            e.taxRate=x.rates[f],
            v=(i-x.from[f])*x.rates[f]+x.cumulative[f]; //tax liability
            var L=0;
            if(careExpenses>0&&"mfs"!==e.filingStatus) {
                var Y=e.childDependents+e.nonChildDependents; // qty of dependents
                if(Y>0) {
                    var j=income+incomeSE+incomeUnemployment; //self income 
                    if("mfj"===e.filingStatus) {
                        var R=incomeSpouse+incomeSpouseSE+incomeSpouseUnemployment; //spouse income
                        j=j>R?R: j //smaller income
                    }
                    var P=Y>1?6e3:3e3; //max expenses
                    P=j>P?P:j; // if (smaller income > max expenses) = max expenses. If (smaller income < max expenses) = smaller income
                    var z=r<15e3?.35:r>=43e3?.2:.34-Math.floor((r-15e3)/2e3)/100; // expense tax credit
                    L=careExpenses>P?z*(P>r?r:P):z*(careExpenses>r?r:careExpenses),
                    u+=L //tax credit
                }
            }
            //console.log(r, "agi")
            //console.log(typeof e.deductions.charitableContributions, e.deductions.charitableContributions,  "total itemised deduction")
            var U=0
            var B=0;
            if(e.childDependents>0||e.nonChildDependents>0) {
                var F="mfj"===e.filingStatus?4e5: 2e5 // max agi to get dependent tax credit
				var W=2e3*e.childDependents+500*e.nonChildDependents //dependent tax credit
				var G=.05*(r>F?1e3*Math.ceil((r-F)/1e3): 0); // 5% от разницы между agi и max agi
                G=G>0? G: 0
				U=W>G? W-G: 0 //credit left if agi over limit
				B=U>v-u? v-u: U  // dependent tax credit
				u+=B // TOTAL dependent tax credit
            }
            var V=0;
            if("mfs"!==e.filingStatus&&function() { // if agi < max agi =>
                var t=[]; /* required (max) agi */
                switch(e.childDependents) {
                    case 0: t=[15270, 20950];
                    break;
                    case 1: t=[40320, 46010];
                    break;
                    case 2: t=[45802, 51492];
                    break;
                    default: t=[49194, 54884]
                }
                return r<("mfj"!==e.filingStatus?t[0]:t[1]) // agi < t = true or false
            }
            ()) {
                var Q=income+incomeSpouse+incomeSE+incomeSpouseSE-A; //income without SE taxes
                (incomeSE+incomeSpouseSE+incomeUnemployment+incomeSpouseUnemployment>0||studentLoanInterest>0)
				&&(Q=r<("mfj"===e.filingStatus?(0===e.childDependents?14200: 24350): 0===e.childDependents?8500: 18700)?Q: r), 
				V=function(t) { // i or 0
                    var n="mfj"===e.filingStatus //true or false
					var r=e.childDependents //n children
					var a=Math.round((t+25)/50)-1  // ?????
					var i=0; //EIC
                    switch(r) {
                        case 0: i=a<135?1.987+3.823*a: a<(n?284: 170)?519: 515.5-3.832*(a-(n?284: 170)); 
                        break;
                        case 1: i=a<203?9+17*a: a<(n?487: 374)?3461: 3457-7.99*(a-(n?487: 374));
                        break;
                        case 2: i=a<285?10+20*a: a<(n?487: 374)?5716: 5711-10.531*(a-(n?487: 374));
                        break;
                        default: i=a<285?11.286+22.5*a: a<(n?487: 374)?6431: 6425-10.528*(a-(n?487: 374))
                    }
                    return i>0?i:0
                }
                (Q),
                n+=V //EIC tax credit/no limit tax credit
            }
            var H=0; // child credit refund balance
            if(e.childDependents>0&&B-U>0) {
                var K=B-U>0?B-U: 0  // child tax credit left over 
				//U credit left if agi over limit
				//B dependent tax credit
				var q=1400*e.childDependents>K?K: 1400*e.childDependents
				var	Z=totalIncome>2500?.15*(totalIncome-2500): 0; // ACTC limit
				
                if(e.childDependents<3||Z>=q)H=Z>q?q: Z;
                else {
                    var J=withholding+A/2-V; //
                    J=J>0?J: 0, J=Z>J?Z: J, H=q>J?J: q
                }
                u+=H
            }
            if(withholding>0&&(n+=withholding), E=v+A+w /*total tax liability*/, e.taxAmount=E-u, (e.taxAmount=e.taxAmount>0?e.taxAmount:0)<=-1400) {
                var _=e.taxAmount-B,
                X=B-_,
                //X=X>B?B: X, e.taxAmount=_-(B-X)-(X>1400?1400: X)
                te=B-(X=X>B?B: X);
                e.taxAmount=_-te-(X>1400?1400: X);
            }
            e.effectiveTaxRate=e.taxAmount/totalIncome,
            e.effectiveTaxRate=e.effectiveTaxRate>0?e.effectiveTaxRate:0,
            e.liability=e.taxAmount-n;
        
            // console.log("pretaxIncome is :" + totalIncome)
            // console.log("standardDeductionFlag is :" + l>=c);
            // console.log("taxAmount is :" + e.taxAmount);
            // console.log("taxRate is :" + e.taxRate);
            // console.log("effectiveTaxRate is :" + e.effectiveTaxRate);
            // console.log("liability is :" + e.liability);
            return({tl: e.taxAmount, lp: e.liability})
        }
        else {
            // console.log("income is 0");
            return({tl: 0, lp: 0})
        }
}