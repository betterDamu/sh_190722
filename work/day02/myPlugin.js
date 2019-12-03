(function (w) {
    w.myPlugin = Object.create(null)

    w.myPlugin.install = function (Vue) {

        Vue.filter('filterDate', function(value){
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
        })

        Vue.directive("move",{
            inserted: function (el,binding) {
                el.style.transition = "2s transform";
                setTimeout(()=>{
                    el.style.transform = `translateX(${binding.value}px)`;
                },20)
            }
        })
    }
})(window)