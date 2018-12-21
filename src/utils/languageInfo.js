export function getLanguageInfo(code){
    switch(code){
        case 'de': 
            return {
                name: "Deutsch",
                icon: './static/images/flags/de.png',
                code:code
            };
        case 'en':
            return{
                name:"English",
                icon: './static/images/flags/en.png',
                code:code
            };
        case 'es':
            return{
                name:"Español",
                icon: './static/images/flags/es.png',
                code:code
            };
        case 'es-mx':
            return{
                name:"Español mexicano",
                icon: './static/images/flags/es-mx.png',
                code:code
            };
        case 'fr':
            return{
                name:"Français",
                icon: './static/images/flags/fr.png',
                code:code
            };
        case 'it':
            return{
                name:"Italiano",
                icon: './static/images/flags/it.png',
                code:code
            };
        case 'ja':
            return{
                name:"日本語",
                icon: './static/images/flags/ja.png',
                code:code
            };
        case 'ko':
            return{
                name:"한국어",
                icon: './static/images/flags/ko.png',
                code:code
            };
        case 'pl':
            return{
                name:"Polski",
                icon: './static/images/flags/pl.png',
                code:code
            };
        case 'pt-br':
            return{
                name:"Português Brasileiro",
                icon: './static/images/flags/pt-br.png',
                code:code
            };
        case 'ru':
            return{
                name:"Русский",
                icon: './static/images/flags/ru.png',
                code:code
            };
        case 'zh-cht':
            return{
                name:"中文",
                icon: './static/images/flags/zh-cht.png',
                code:code
            };
        case 'zh-chs':
            return{
                name:"简化字",
                icon: './static/images/flags/zh-cht.png',
                code:code
            };
        default:
        return {code:code};
    }
}