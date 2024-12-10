
const primaryBaseUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const fallbackBaseUrl = "https://latest.currency-api.pages.dev/v1/currencies";
const dropdown=document.querySelectorAll(".dropdown select");

const btn=document.querySelector("form button");
const fromCurr=document.querySelector(".from select");
const toCurr=document.querySelector(".to select");
const resultDisplay = document.querySelector(".msg"); 

for(let select of dropdown){
    for(currCode in  countryList){
        let newOption=document.createElement("option");
        newOption.innerText=currCode;
        newOption.value=currCode;
        if(select.name=="from" && currCode=="USD"){
            newOption.selected="selected";
        }else if(select.name=="to" && currCode=="INR"){
            newOption.selected="selected";
        }
        select.append(newOption);

    }
    select.addEventListener("change",(evt)=>{
        updateFlag(evt.target);
    })
        
}
const updateFlag=(element)=>{
    let currCode=element.value;
    console.log(currCode);
    let countryCode=countryList[currCode];
    let newSrc=`https://flagsapi.com/${countryCode}/flat/64.png`;
    let img=element.parentElement.querySelector("img");
    img.src=newSrc;
};

const fetchConversionRates = async (baseCurrency) => {
    const primaryUrl = `${primaryBaseUrl}/${baseCurrency.toLowerCase()}.json`;
    const fallbackUrl = `${fallbackBaseUrl}/${baseCurrency.toLowerCase()}.json`;

    try {
        let response = await fetch(primaryUrl);
        if (!response.ok) {
            throw new Error(`Primary URL failed: ${response.status}`);
        }
        let data = await response.json();
        console.log('Primary API data:', data);
        return data;
    } catch (error) {
        console.error('Fetch error from primary URL:', error);
        try {
            let response = await fetch(fallbackUrl);
            if (!response.ok) {
                throw new Error(`Fallback URL failed: ${response.status}`);
            }
            let data = await response.json();
            console.log('Fallback API data:', data);
            return data;
        } catch (error) {
            console.error('Fetch error from fallback URL:', error);
            return null;
        }
    }
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    
    if (amtVal == "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const fromCurrency = fromCurr.value.toLowerCase();
    const toCurrency = toCurr.value.toLowerCase();
    const ratesData = await fetchConversionRates('usd'); // Fetch rates with 'usd' as base
    const baseCurrency = 'usd'; // Define base currency
    if (ratesData && ratesData[baseCurrency]) {

        const rates = ratesData[baseCurrency];


        console.log('Available rates:', rates);

        let rateFromBase = rates[fromCurrency];
        let rateToBase = rates[toCurrency];

        if (rateFromBase && rateToBase) {
            let amountInBase = amtVal / rateFromBase;
            let convertedAmount = amountInBase * rateToBase;
            console.log(`Converted amount: ${convertedAmount}`);
            let exchangeRate = rateToBase / rateFromBase;
            resultDisplay.textContent = ` ${amtVal} ${fromCurrency.toUpperCase()} = ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}`;
        } else {
            console.error('Currency code not found in rates:', fromCurrency, toCurrency);
        }
    } else {
        console.error('Failed to fetch conversion rates.')
    }
});
