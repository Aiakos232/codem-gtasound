const store = Vuex.createStore({
    components: {},

    state: {},
    getters: {},
    mutations: {},
    actions: {}
});
const app = Vue.createApp({
    components: {},
    data: () => ({
        show: false,
        soundlist: false,
        isHover: -1,
        searchInput: "",

    }),
    computed: {
        filterByTermAllData() {
            if (this.searchInput.length > 0) {
                if (!this.soundlist || this.soundlist <= 0) {
                    return this.soundlist;
                }
                return this.soundlist.filter(name => {
                    return (
                        String(name.audioname).toLowerCase().includes(this.searchInput.toLowerCase()) ||
                        String(name.audiored).toLowerCase().includes(this.searchInput.toLowerCase())
                    );
                });
            } else {
                return this.soundlist;
            }

        }
    },

    watch: {},

    beforeDestroy() { },
    mounted() {
        window.addEventListener("keyup", this.keyHandler);
        window.addEventListener("message", this.eventHandler);
    },

    methods: {
        soundPlay(val) {
            postNUI("playsound", val);
        },
        copyData(val) {
            postNUI("copyData", val);
        },

        keyHandler(event) {
            console.log(event.key)
            if (event.key === "Escape") {
                console.log('tyes')
                this.show = false;
                postNUI("close", true);
            }
        },

        eventHandler(event) {
            switch (event.data.action) {
                case "CHECK_NUI":
                    postNUI("loaded", true);
                    break;
                case "listload":
                    this.show = true;
                    this.soundlist = event.data.payload;
                    break;
                case "copy":
                    const el = document.createElement("textarea");
                    el.value = event.data.payload;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand("copy");
                    document.body.removeChild(el);
                    break;
                default:
                    break;
            }
        }
    }
});

app.use(store).mount("#app");
var resourceName = "codem-gtasound";

if (window.GetParentResourceName) {
    resourceName = window.GetParentResourceName();
}

window.postNUI = async (name, data) => {
    try {
        const response = await fetch(`https://${resourceName}/${name}`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });
        return !response.ok ? null : response.json();
    } catch (error) {
        // console.log(error)
    }
};

