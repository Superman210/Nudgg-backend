module.exports = (acctList) => {
  return new Promise((resolve, reject) => {
    if (acctList) {
      let investBalance = 0;
      let cashBalance = 0;
      let invest = [], cash = [];
      for (let i = 0; i < acctList.length; i++) {
        let container = acctList[i].container;
        if (acctList[i].balance) {
          if (container == 'investment' && acctList[i].balance.amount) {
            investBalance += parseInt(acctList[i].balance.amount);
            invest.push(acctList[i]);
          } else if (acctList[i].balance.amount){
            cashBalance += parseInt(acctList[i].balance.amount);
            cash.push(acctList[i]);
          }
        }
      }
      const balance = {
        balance: {
          investment: investBalance,
          cash: cashBalance
        },
        acctList: {
          investment: invest,
          cash: cash
        }
      }
      resolve(balance);
    } else {
      reject('error');
    }
  });
}