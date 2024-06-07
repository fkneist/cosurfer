import{e as M,c as T,I as V,C as _,f as g,P as c,H as O,g as j,i as h,h as I,k as v,p as w,B as y,A as C,l as E}from"./index.js";class m extends M{static lc_name(){return"ImagePromptTemplate"}constructor(e){if(super(e),Object.defineProperty(this,"lc_namespace",{enumerable:!0,configurable:!0,writable:!0,value:["langchain_core","prompts","image"]}),Object.defineProperty(this,"template",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"templateFormat",{enumerable:!0,configurable:!0,writable:!0,value:"f-string"}),Object.defineProperty(this,"validateTemplate",{enumerable:!0,configurable:!0,writable:!0,value:!0}),this.template=e.template,this.templateFormat=e.templateFormat??this.templateFormat,this.validateTemplate=e.validateTemplate??this.validateTemplate,this.validateTemplate){let a=this.inputVariables;this.partialVariables&&(a=a.concat(Object.keys(this.partialVariables))),T([{type:"image_url",image_url:this.template}],this.templateFormat,a)}}_getPromptType(){return"prompt"}async partial(e){const a=this.inputVariables.filter(s=>!(s in e)),r={...this.partialVariables??{},...e},t={...this,inputVariables:a,partialVariables:r};return new m(t)}async format(e){const a={};for(const[o,i]of Object.entries(this.template))typeof i=="string"?a[o]=i.replace(/{([^{}]*)}/g,(u,l)=>{const p=e[l];return typeof p=="string"||typeof p=="number"?String(p):u}):a[o]=i;const r=e.url||a.url,t=e.detail||a.detail;if(!r)throw new Error("Must provide either an image URL.");if(typeof r!="string")throw new Error("url must be a string.");const s={url:r};return t&&(s.detail=t),s}async formatPromptValue(e){const a=await this.format(e);return new V(a)}}class b extends E{constructor(){super(...arguments),Object.defineProperty(this,"lc_namespace",{enumerable:!0,configurable:!0,writable:!0,value:["langchain_core","prompts","chat"]}),Object.defineProperty(this,"lc_serializable",{enumerable:!0,configurable:!0,writable:!0,value:!0})}async invoke(e,a){return this._callWithConfig(r=>this.formatMessages(r),e,{...a,runType:"prompt"})}}class F extends b{static lc_name(){return"MessagesPlaceholder"}constructor(e){typeof e=="string"&&(e={variableName:e}),super(e),Object.defineProperty(this,"variableName",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"optional",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.variableName=e.variableName,this.optional=e.optional??!1}get inputVariables(){return[this.variableName]}validateInputOrThrow(e,a){if(this.optional&&!e)return!1;if(!e){const t=new Error(`Error: Field "${a}" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages as an input value. Received: undefined`);throw t.name="InputFormatError",t}let r=!1;if(Array.isArray(e)?r=e.every(t=>h(t)):r=h(e),!r){const t=typeof e=="string"?e:JSON.stringify(e,null,2),s=new Error(`Error: Field "${a}" in prompt uses a MessagesPlaceholder, which expects an array of BaseMessages as an input value. Received: ${t}`);throw s.name="InputFormatError",s}return!0}async formatMessages(e){return this.validateInputOrThrow(e[this.variableName],this.variableName),e[this.variableName]??[]}}class S extends b{constructor(e){"prompt"in e||(e={prompt:e}),super(e),Object.defineProperty(this,"prompt",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.prompt=e.prompt}get inputVariables(){return this.prompt.inputVariables}async formatMessages(e){return[await this.format(e)]}}class x extends M{constructor(e){super(e)}async format(e){return(await this.formatPromptValue(e)).toString()}async formatPromptValue(e){const a=await this.formatMessages(e);return new _(a)}}class B extends S{static lc_name(){return"ChatMessagePromptTemplate"}constructor(e,a){"prompt"in e||(e={prompt:e,role:a}),super(e),Object.defineProperty(this,"role",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.role=e.role}async format(e){return new v(await this.prompt.format(e),this.role)}static fromTemplate(e,a,r){return new this(c.fromTemplate(e,{templateFormat:r==null?void 0:r.templateFormat}),a)}}class d extends b{static _messageClass(){throw new Error("Can not invoke _messageClass from inside _StringImageMessagePromptTemplate")}constructor(e,a){if("prompt"in e||(e={prompt:e}),super(e),Object.defineProperty(this,"lc_namespace",{enumerable:!0,configurable:!0,writable:!0,value:["langchain_core","prompts","chat"]}),Object.defineProperty(this,"lc_serializable",{enumerable:!0,configurable:!0,writable:!0,value:!0}),Object.defineProperty(this,"inputVariables",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"additionalOptions",{enumerable:!0,configurable:!0,writable:!0,value:{}}),Object.defineProperty(this,"prompt",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"messageClass",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"chatMessageClass",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.prompt=e.prompt,Array.isArray(this.prompt)){let r=[];this.prompt.forEach(t=>{"inputVariables"in t&&(r=r.concat(t.inputVariables))}),this.inputVariables=r}else this.inputVariables=this.prompt.inputVariables;this.additionalOptions=a??this.additionalOptions}createMessage(e){const a=this.constructor;if(a._messageClass()){const r=a._messageClass();return new r({content:e})}else if(a.chatMessageClass){const r=a.chatMessageClass();return new r({content:e,role:this.getRoleFromMessageClass(r.lc_name())})}else throw new Error("No message class defined")}getRoleFromMessageClass(e){switch(e){case"HumanMessage":return"human";case"AIMessage":return"ai";case"SystemMessage":return"system";case"ChatMessage":return"chat";default:throw new Error("Invalid message class name")}}static fromTemplate(e,a){if(typeof e=="string")return new this(c.fromTemplate(e,a));const r=[];for(const t of e)if(typeof t=="string"||typeof t=="object"&&"text"in t){let s="";typeof t=="string"?s=t:typeof t.text=="string"&&(s=t.text??""),r.push(c.fromTemplate(s))}else if(typeof t=="object"&&"image_url"in t){let s=t.image_url??"",o,i=[];if(typeof s=="string"){const l=w(s).flatMap(p=>p.type==="variable"?[p.name]:[]);if(((l==null?void 0:l.length)??0)>0){if(l.length>1)throw new Error(`Only one format variable allowed per image template.
Got: ${l}
From: ${s}`);i=[l[0]]}else i=[];s={url:s},o=new m({template:s,inputVariables:i})}else if(typeof s=="object")"url"in s?i=w(s.url).flatMap(l=>l.type==="variable"?[l.name]:[]):i=[],o=new m({template:s,inputVariables:i});else throw new Error("Invalid image template");r.push(o)}return new this({prompt:r,additionalOptions:a})}async format(e){if(this.prompt instanceof y){const a=await this.prompt.format(e);return this.createMessage(a)}else{const a=[];for(const r of this.prompt){let t={};if(!("inputVariables"in r))throw new Error(`Prompt ${r} does not have inputVariables defined.`);for(const s of r.inputVariables)t||(t={[s]:e[s]}),t={...t,[s]:e[s]};if(r instanceof y){const s=await r.format(t);a.push({type:"text",text:s})}else if(r instanceof m){const s=await r.format(t);a.push({type:"image_url",image_url:s})}}return this.createMessage(a)}}async formatMessages(e){return[await this.format(e)]}}class P extends d{static _messageClass(){return O}static lc_name(){return"HumanMessagePromptTemplate"}}class A extends d{static _messageClass(){return C}static lc_name(){return"AIMessagePromptTemplate"}}class $ extends d{static _messageClass(){return j}static lc_name(){return"SystemMessagePromptTemplate"}}function N(n){return typeof n.formatMessages=="function"}function R(n,e){if(N(n)||h(n))return n;if(Array.isArray(n)&&n[0]==="placeholder"){const t=n[1];if(typeof t!="string"||t[0]!=="{"||t[t.length-1]!=="}")throw new Error(`Invalid placeholder template: "${n[1]}". Expected a variable name surrounded by curly braces.`);const s=t.slice(1,-1);return new F({variableName:s,optional:!0})}const a=I(n);let r;if(typeof a.content=="string"?r=a.content:r=a.content.map(t=>"text"in t?{text:t.text}:"image_url"in t?{image_url:t.image_url}:t),a._getType()==="human")return P.fromTemplate(r,e);if(a._getType()==="ai")return A.fromTemplate(r,e);if(a._getType()==="system")return $.fromTemplate(r,e);if(v.isInstance(a))return B.fromTemplate(a.content,a.role,e);throw new Error(`Could not coerce message prompt template from input. Received message type: "${a._getType()}".`)}function H(n){return n.constructor.lc_name()==="MessagesPlaceholder"}class f extends x{static lc_name(){return"ChatPromptTemplate"}get lc_aliases(){return{promptMessages:"messages"}}constructor(e){if(super(e),Object.defineProperty(this,"promptMessages",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"validateTemplate",{enumerable:!0,configurable:!0,writable:!0,value:!0}),Object.defineProperty(this,"templateFormat",{enumerable:!0,configurable:!0,writable:!0,value:"f-string"}),e.templateFormat==="mustache"&&e.validateTemplate===void 0&&(this.validateTemplate=!1),Object.assign(this,e),this.validateTemplate){const a=new Set;for(const i of this.promptMessages)if(!(i instanceof g))for(const u of i.inputVariables)a.add(u);const r=this.inputVariables,t=new Set(this.partialVariables?r.concat(Object.keys(this.partialVariables)):r),s=new Set([...t].filter(i=>!a.has(i)));if(s.size>0)throw new Error(`Input variables \`${[...s]}\` are not used in any of the prompt messages.`);const o=new Set([...a].filter(i=>!t.has(i)));if(o.size>0)throw new Error(`Input variables \`${[...o]}\` are used in prompt messages but not in the prompt template.`)}}_getPromptType(){return"chat"}async _parseImagePrompts(e,a){if(typeof e.content=="string")return e;const r=await Promise.all(e.content.map(async t=>{if(t.type!=="image_url")return t;let s="";typeof t.image_url=="string"?s=t.image_url:s=t.image_url.url;const i=await c.fromTemplate(s).format(a);return typeof t.image_url!="string"&&"url"in t.image_url?t.image_url.url=i:t.image_url=i,t}));return e.content=r,e}async formatMessages(e){const a=await this.mergePartialAndUserVariables(e);let r=[];for(const t of this.promptMessages)if(t instanceof g)r.push(await this._parseImagePrompts(t,a));else{const s=t.inputVariables.reduce((i,u)=>{if(!(u in a)&&!(H(t)&&t.optional))throw new Error(`Missing value for input variable \`${u.toString()}\``);return i[u]=a[u],i},{}),o=await t.formatMessages(s);r=r.concat(o)}return r}async partial(e){const a=this.inputVariables.filter(s=>!(s in e)),r={...this.partialVariables??{},...e},t={...this,inputVariables:a,partialVariables:r};return new f(t)}static fromTemplate(e,a){const r=c.fromTemplate(e,a),t=new P({prompt:r});return this.fromMessages([t])}static fromMessages(e,a){const r=e.reduce((o,i)=>o.concat(i instanceof f?i.promptMessages:[R(i,a)]),[]),t=e.reduce((o,i)=>i instanceof f?Object.assign(o,i.partialVariables):o,Object.create(null)),s=new Set;for(const o of r)if(!(o instanceof g))for(const i of o.inputVariables)i in t||s.add(i);return new this({...a,inputVariables:[...s],promptMessages:r,partialVariables:t,templateFormat:a==null?void 0:a.templateFormat})}static fromPromptMessages(e){return this.fromMessages(e)}}export{x as B,f as C,P as H,$ as S};