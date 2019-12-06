export default {
   get(key,defVal){
     return localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)):defVal
   },
   set(key,val){
     localStorage.setItem(key, JSON.stringify(val));
   }
}
