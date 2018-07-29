function calculateMortgage(initialDebt, interestRatePercent, initialRepaymentRatePercent, monthsLimit) {
    const initialDebtInCents = Math.round(initialDebt * 100);
    const monthlyInterestRate = interestRatePercent / 100.0 / 12.0;
    const initialMonthlyRepaymentRate = initialRepaymentRatePercent / 100.0 / 12.0;
  
    const toEuros = function(cents) {
      return (cents / 100.0).toFixed(2);
    }
  
    let totalInterestInCents = 0;
    let months = [];
    let firstRate = null;
    let lastRate = null;
    let finalDebt = null;
  
    for (const month of repaymentPlan(initialDebtInCents, monthlyInterestRate, initialMonthlyRepaymentRate, monthsLimit)) {
      totalInterestInCents += month.interest;
      totalPayment = toEuros(month.totalPayment);
  
      if (firstRate == null) {
        firstRate = totalPayment;
      }
  
      lastRate = totalPayment;
      finalDebt = toEuros(month.debt)
  
      months.push({
        debt : toEuros(month.debt),
        totalPayment : totalPayment,
        interest : toEuros(month.interest),
        repayment : toEuros(month.repayment)
      });
    }
  
    return {
      interestRatePercent : interestRatePercent,
      initialRepaymentRatePercent : initialRepaymentRatePercent,
      totalInterestPaid : toEuros(totalInterestInCents),
      finalDebt : finalDebt,
      numberOfPayments : months.length - 1 + lastRate / firstRate,
      duration : function() { if (finalDebt == 0) return months.length; else return null;}(),
      months : months,
      firstRate : firstRate,
      lastRate : lastRate
    };
  }
  
function *repaymentPlan(initialDebt, interestRate, initialRepaymentRate, monthsLimit) {
    let centsOwed = initialDebt;
    const monthlyCentsPaid = Math.round(centsOwed * (interestRate + initialRepaymentRate));
  
    let n = 0;
  
    while (centsOwed > 0 && n++ <= monthsLimit) {
      const interest = Math.round(centsOwed * interestRate);
      const repayment = Math.min(centsOwed, monthlyCentsPaid - interest);
      centsOwed -= repayment;
  
      yield {
        debt : centsOwed,
        totalPayment : interest + repayment,
        interest : interest,
        repayment : repayment
      };
    }
  }