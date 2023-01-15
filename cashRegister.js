// We have money object with the value equivalence
const units = {
    "PENNY": 1,
    "NICKEL": 5,
    "DIME": 10,
    "QUARTER": 25,
    "ONE": 100,
    "FIVE": 500,
    "TEN": 1000,
    "TWENTY": 2000,
    "ONE HUNDRED": 10000
}

// We define insufficient found
const insu = {
    status: "INSUFFICIENT_FUNDS",
    change: []
}

/**
 * Return the status and change of the register
 */
function checkCashRegister(price, cash, cid) {
    // Get the ammount to be change we pass to non float
    let diff = cash * 100 - price * 100;

    // First check if the founds are insuficcient or closed
    let due = getRegister(cid) - diff;
    if (due == 0) 
        return { status: "CLOSED", change: [...cid] };
    if (due < 0)
        return insu;

    // If there are enough funds, then we proceed to return
    return getChange(cid, diff);
}

/**
 * Checks if the total of money in register is higher amount than what has to
 * be given back
 */
function getRegister(cid) {
    return cid
        .flat()
        .filter(data => data == Number(data)) // To get only the prices
        .map(data => data * 100) // To avoid bad float point precision issues
        .reduce((sum, val) => sum + val, 0); // Back to 2 decimals
}

/**
 * Returns the change unless there's no exact change
 */
function getChange(cid, diff) {
    let exchange = [];

    // We check all the change array given and return when due is 0
    for (let i = cid.length - 1; i >= 0; i--) {
        // First we get the units name and the diff of value with what's due
        const res = ((cid[i][1] > 0) ? (diff - units[cid[i][0]]) : -1);

        // If we can use this unit to add to the change
        if (res >= 0) {
            // We get the subarray with the unit and value and the new diff
            let data = getUnits(cid, i, diff);
            exchange.push(data[0]);
            diff = data[1];
        };

        // If what's due is 0, this means we can give it back
        if (diff == 0)
            return { status: "OPEN", change: exchange };
    }

    // If we didnt send the change back at this points, we dont have proper units to do so
    return insu;
}

/**
 * Return the subarray that indicates the unit and quantity
 */
function getUnits(cid, i, diff) {
    const val = units[cid[i][0]]; // Get the value of the unit
    let sb = [cid[i][0], 0];
    let available = (cid[i][1] * 100 / val);// Quantity of money of that unit available

    // Get the amount of this units change
    while (diff - val >= 0 && available > 0) {
        sb[1] += val;
        diff -= val;
        available--;
    }

    // Back to the 2 decimals and return change from this quuantity
    sb[1] /= 100;
    return [sb, diff];
}

// Examples of execution
console.log(
    checkCashRegister(100, 276.5, [
        ["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 2.1], ["QUARTER", 1.75], 
        ["ONE", 10], ["FIVE", 15], ["TEN", 20], ["TWENTY", 80], ["ONE HUNDRED", 200]
    ])
);