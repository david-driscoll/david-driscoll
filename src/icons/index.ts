import { IconDefinition, library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import type {  VueConstructor} from 'vue';
import { VuetifyIcon, VuetifyIcons } from 'vuetify/types/services/icons';
import { from } from 'ix/iterable';
import { filter, map } from 'ix/iterable/operators';
import '../../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false;

function constant<T>(value: T) {
    return () => value;
}

export function iconPlugin(Vue: VueConstructor, icons: { [K in keyof VuetifyIcons]: IconDefinition } | Record<string, IconDefinition>): Record<keyof VuetifyIcons, VuetifyIcon>  {
    library.add(...Object.values(icons));

    const iconDescriptions: Record<string, {
        configurable: false;
        enumerable: true;
        get(): IconDefinition & VuetifyIcon;
    }> = {};
    for (const [key, icon] of Object.entries(icons)) {
        iconDescriptions[key] = {
            configurable: false,
            enumerable: true,
            get: constant(create(icon))
        };
    }

    const faStart = /^fa([A-Z])/;
    from(Object.entries(iconDescriptions))
        .pipe(filter(z => faStart.test(z[0])))
        .forEach(([key, value]) => {
            let newKey = key.replace(faStart, '$1');
            newKey = newKey[0].toLowerCase() + newKey.substring(1);
            iconDescriptions[newKey] = value;
        });


    Vue.mixin({
        components: {
            FontAwesomeIcon,
            FaIcon: FontAwesomeIcon,
            FontAwesomeLayers,
            FaLayer: FontAwesomeLayers,
            FontAwesomeLayersText,
            FaText: FontAwesomeLayersText,
        },
        beforeCreate() {
            this.$options.inject = this.$options.inject ?? {};
            if (Array.isArray(this.$options.inject)) return;

            const definitions: Record<string, IconDefinition> = {};
            for (const [key, icon] of Object.entries(this.$options.icons ?? {})) {
                definitions[key] = create(icon);
            }
            from(Object.entries(definitions))
                .pipe(filter(z => faStart.test(z[0])))
                .forEach(([key, value]) => {
                    let newKey = key.replace(faStart, '$1');
                    newKey = newKey[0].toLowerCase() + newKey.substring(1);
                    definitions[newKey] = value;
                });
            Object.defineProperties(definitions, iconDescriptions);
            this.$options.inject.$icons = { default: definitions };
        }
    });

    const result: Record<keyof VuetifyIcons, VuetifyIcon> = {};
    for (const [key, icon] of Object.entries(iconDescriptions)) {
        result[key] = icon.get();
    }

    return result;
}

function create(icon: IconDefinition): IconDefinition & VuetifyIcon {
    return { ...icon, component: FontAwesomeIcon, props: { icon } };
}

const items = {
    disabled: { type: Boolean }  ,
    left: { type: Boolean }  ,
    right: { type: Boolean }  ,
    small: { type: Boolean }  ,
    large: { type: Boolean },
    'primaryOpacity': { type: [String, Number] },
    'secondaryOpacity': { type: [String, Number] },
    'primaryColor': { type: String },
    'secondaryColor': { type: String },
};

Object.assign(FontAwesomeIcon.props, items);
FontAwesomeIcon.render = wrap(FontAwesomeIcon.render!);

function wrap<T extends Function>(fn: T): T {
    return function (this: any, create: any, context: any) {
        if (!context.data.staticClass) context.data.staticClass = 'v-icon';
        else if (!context.data.staticClass.includes('v-icon')) context.data.staticClass += ' v-icon';

        if (!context.data.class) {
            context.data.class = {};
        }
        if (!context.data.attrs) {
            context.data.attrs = {};
        }
        if (!context.data.style) {
            context.data.style = {};
        }

        context.data.class['v-icon--disabled'] = p(context, 'disabled');
        context.data.class['v-icon--left'] = p(context, 'left');
        context.data.class['v-icon--right'] = p(context, 'right');
        context.data.class['v-icon--link'] = context.data.on && (context.data.on.click || context.data.on['!click']);
        context.data.class['v-icon--small'] = p(context, 'small');
        context.data.class['v-icon--large'] = p(context, 'large');
        context.data.attrs['aria-hidden'] = true;

        context.data.style['--fa-primary-opacity'] = p(context, 'primaryOpacity');
        context.data.style['--fa-secondary-opacity'] = p(context, 'secondaryOpacity');
        context.data.style['--fa-primary-color'] = p(context, 'primaryColor');
        context.data.style['--fa-secondary-color'] = p(context, 'secondaryColor');

        return fn.call(this, create, context);
    } as any;

    function p(context: any, name: string) {
        if (context.private  && context.parent.$props) {
            return context.parent.$props.hasOwnProperty(name) ? context.parent.$props[name] : context.props[name];
        }
        return context.props[name];
    }
}