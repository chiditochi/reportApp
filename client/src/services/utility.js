/* This module supplies utility functions  */

const Utility = {};

const padStart = (val, padVal = 2) => {
  if (val === "" || undefined || null) {
    console.error("Invalid val to pad: ", val);
    return;
  }
  return val.toString().padStart(padVal, "0");
};

const getTransfer = async (url) => {
  const r = await fetch(url);
  return r.json();
};

Utility.getAppTime = () => {
  const time = new Date();
  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  let hr = h.toString().length < 2 ? padStart(h) : h;
  let mm = m.toString().length < 2 ? padStart(m) : m;
  let ss = s.toString().length < 2 ? padStart(s) : s;
  return `${hr}:${mm}:${ss} ${h < 12 ? "AM" : "PM"}`;

  //return new Date().toLocaleTimeString();
};

Utility.getAppDate = () => {
  return new Date().toLocaleDateString();
};

Utility.capitalize = (val) => {
  return val ? val[0].toUpperCase() + val.slice(1) : val;
};

Utility.getTime = (date) => {
  const dd = new Date(date);
  return `${dd.getHours()}:${dd.getMinutes()}:${dd.getSeconds()}`;
};

Utility.getDate = (date) => {
  const dd = new Date(date);
  return `${dd.getFullYear()}-${dd.getMonth() + 1}-${dd.getDate()}`;
};

Utility.getPaddedDate = (date) => {
  const dd = new Date(date);
  return `${padStart(dd.getFullYear())}-${padStart(
    dd.getMonth() + 1
  )}-${padStart(dd.getDate())}`;
};

Utility.formatDate = (date) => {
  if (date === null || date === undefined) {
    console.log("Date in wrong format");
    return;
  }
  return `${Utility.getDate(date)} ${Utility.getTime(date)}`;
};

Utility.formatCurrency = (num, isCurrency = true) => {
  /* true for currency and false for count */
  const formatValue = isCurrency ? 2 : 0;
  const options = {
    minimumFractionDigits: formatValue,
    maximumFractionDigits: formatValue,
  };
  const formatted = Number(num).toLocaleString("en", options);
  return formatted;
};

Utility.formatCount = (num, addComma = true) => {
  /* true for currency and false for count */
  const formatValue = addComma ? 2 : 0;
  const options = {
    minimumFractionDigits: formatValue,
    maximumFractionDigits: formatValue,
  };
  const formatted = addComma
    ? Number(num).toLocaleString("en", options)
    : Number(num);
  return formatted;
};

Utility.formatCalenderDate = (dateObj) => {
  /* dateObj is a date object */
  if (!dateObj || dateObj.keys.length) {
    console.error("Wrong date Object: ", dateObj);
    return;
  }
  return `${dateObj.year()}-${dateObj.month() + 1}-${dateObj.date()}`;
};

Utility.getBankDetails = (find) => {
  const d = {
    "058": "GTB",
    "082": "KEYSTONE",
    "044": "ACCESS",
    "070": "FIDELITY",
    "215": "UNITY",
    "221": "STANBIC",
    "214": "FCMB",
    "050": "ECOBANK",
    "301": "JAIZ",
    "011": "FBN",
    "076": "POLARIS",
    "035": "WEMA",
    "033": "UBA",
    "057": "ZENITH",
    "232": "STERLING",
    "030": "HERITAGE",
    "068": "SCB",
    "102": "Titan",
    "103": "Globus",
    "063": "DBN Access",
    "501": "PayAttitude",
  };
  const result = !find ? d : d[find] ? d[find] : find;
  //console.log("getBankDetails: ", result)
  return result;
};

Utility.getTransfer = async (url) => {
  const j = await fetch(url);
  return await j.json();
};

Utility.getQueryIDOptions = () => {
  return [
    { id: 1, value: "requestid", label: "Request ID" },
    { id: 2, value: "reference", label: "Reference ID" },
  ];
};

Utility.getBanks = (data) => {
  //console.log("Typeof: ", typeof data);
  if (data.length === 0) return [];
  const result = data.reduce((a, c) => {
    let i = a.findIndex((x) => x === c.destbank);
    if (i === -1) a.push(c.destbank);
    return a;
  }, []);
  return result;
};

Utility.dateIsPast = (date) => {
  const d = new Date(date);
  const today = new Date();
  if (d.getDate() === today.getDate()) return false;
  return today.getTime() > d.getTime();
};

module.exports = Utility;
