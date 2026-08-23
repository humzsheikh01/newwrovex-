const KEY='rovex-trading:v1';
export const defaults={ticker:'AAPL', timeframe:'1d', replaySpeed:1, theme:'dark', accentColor:'#2962ff', accountBalance:10000, riskPercent:1, sound:false, bookmarks:[], drawings:[]};
export function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return defaults}}
export function save(value){try{localStorage.setItem(KEY,JSON.stringify(value))}catch{}}
