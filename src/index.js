import _ from 'lodash';

const VueGetData = {
    install(Vue) {

        Vue.mixin({
            data() {
                return {
                    loadComponent: true,
                };
            },
            methods: {
                reloadComponent() {
                    this.loadComponent = false;
                    this.$nextTick(function () {
                        this.loadComponent = true;
                    });
                },
            }
        });

        Vue.prototype.$vueData = function () {
            return {
                process(response) {
                    const data = this.getData(response);
                    const message = this.getMessage(response);

                    if (message) {
                        this.alert(message);
                    }

                    return data;
                },
                getMessage(response) {
                    if (_.has(response, 'meta.message')) {
                        return _.get(response, 'meta.message');
                    }

                    if (_.has(response, 'data.meta.message')) {
                        return _.get(response, 'data.meta.message');
                    }

                    if (_.isString(response)) {
                        return response;
                    }

                    return null;
                },
                getData(response) {
                    if (_.has(response, 'data')) {
                        return this.getData(_.get(response, 'data'));
                    }

                    return response;
                },
                getMeta(response) {
                    if (_.has(response, 'meta')) {
                        return this.getMeta(_.get(response, 'meta'));
                    } else if (_.has(response, 'data')) {
                        return this.getMeta(_.get(response, 'data'));
                    }

                    return response;
                },
            };
        };
    },
};

export default VueGetData;
