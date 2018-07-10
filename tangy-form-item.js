import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js'
import './tangy-common-styles.js'
import { TangyFormItemHelpers } from './tangy-form-item-callback-helpers.js'

/**
 * `tangy-form-item`
 * An element used to encapsulate form elements for multipage forms with a response in PouchDB.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

export class TangyFormItem extends PolymerElement {

  static get template() {
    return html`
  <style include="tangy-common-styles"></style>
  <style>
:host {
  margin: 15px;
}
/*
 * Card
 */
paper-card {
  -webkit-transition: .4s;
  -moz-transition: .4s;
  -ms-transition: .4s;
  -o-transition: .4s;
  display: block;
  max-width: 325px;
  margin: /*30px*/ auto;
}
:host([open]) paper-card {
  -webkit-transition: .4s;
  -moz-transition: .4s;
  -ms-transition: .4s;
  -o-transition: .4s;
  display: block;
  max-width: 920px;
}
:host([disabled]) paper-card {
  --paper-card-background-color: gray !important;
  --paper-card-header-color: #CCC;
}
:host([hidden]) {
  display: none;
}

/*
 * Action Buttons
 */
.card-actions {
  height: 45px;
  margin-bottom: 100px;
}
:host([open]) #open {
  display: none;
}
:host([locked]) #complete {
  display: none;
}
:host(:not([open])) #close {
  display: none;
}
:host([disabled]) #open {
  display: none;
}
label.heading {
  font-size: 21px !important;
  margin-bottom: 20px;
  display: block;
  color: var(--primary-color);
  font-weight: 700;
}

#next {
  float: right;
  width: 84px;
}
#next iron-icon {
  margin: 0px 0px 0px 21px;
}

#back {
  float: left;
  width: 84px;
}
#back iron-icon {
  margin: 0px 0px 0px 21px;
}

.card-actions paper-button {
  font-size: .8em;
  line-height: 1em;
}

</style>

<paper-card id="card" class="shrunk">

  <div class="card-content">
  <label class="heading">[[title]]</label>
    <div id="content"></div>
    <slot></slot>
  </div>

  <div class="card-actions">
    <template is="dom-if" if="{{!hideButtons}}">
      <paper-button id="open" on-click="onOpenButtonPress">Open</paper-button>
      <template is="dom-if" if="{{!locked}}">
        <paper-button id="close" on-click="onCloseButtonPress">Save</paper-button>
      </template>
      <template is="dom-if" if="{{locked}}">
        <paper-button id="close" on-click="onCloseButtonPress">Close</paper-button>
      </template>
    </template>
    <template is="dom-if" if="{{open}}">

      <template is="dom-if" if="{{rightToLeft}}">
        <template is="dom-if" if="{{showCompleteButton}}">
          <paper-button id="complete" on-click="clickedComplete" style="float:left">
            submit
          <paper-button>
        </template>
        <template is="dom-if" if="{{!hideNextButton}}">
          <paper-button id="back" on-click="next" >
            <iron-icon icon="arrow-back"></iron-icon>
          <paper-button>
        </template>
        <template is="dom-if" if="{{!hideBackButton}}">
          <paper-button id="next" on-click="back" >
            <iron-icon icon="arrow-forward"></iron-icon>
          <paper-button>
        </template>
      </template>

      <template is="dom-if" if="{{!rightToLeft}}">
        <template is="dom-if" if="{{!hideBackButton}}">
          <paper-button id="back" on-click="back" >
            <iron-icon icon="arrow-back"></iron-icon>
          <paper-button>
        </template>
        <template is="dom-if" if="{{!hideNextButton}}">
          <paper-button id="next" on-click="next" >
            <iron-icon icon="arrow-forward"></iron-icon>
          <paper-button>
        </template>
        <template is="dom-if" if="{{showCompleteButton}}">
          <paper-button id="complete" on-click="clickedComplete" style="float:right" >
            submit
          <paper-button>
        </template>
      </template>

    </template>
    <template is="dom-if" if="{{!incomplete}}">
      <iron-icon style="color: var(--primary-color); float: right; margin-top: 10px" icon="icons:check-circle"></iron-icon>
    </template>
  </div>

  </paper-card>`
  }

  static get is() { return 'tangy-form-item'; }

  constructor() {
    super()
  }

  static get properties() {
    return {

      // Configuration
      id: {
        type: String,
        value: 'tangy-form-item',
        reflectToAttribute: true
      },
      src: {
        type: String,
        value: 'tangy-form-item',
        reflectToAttribute: true
      },
      title: {
        type: String,
        value: '',
        reflectToAttribute: true
      },
      summary: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      hideButtons: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      hideBackButton: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      rightToLeft: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      hideNextButton: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      showCompleteButton: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      inputs: {
        type: Array,
        observer: 'reflect',
        value: []
      },

      // State
      open: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: 'onOpenChange',
      },
      incomplete: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      hidden: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      locked: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }

    };
  }

  // Apply state in the store to the DOM.
  reflect() {
    this.inputs.forEach((inputState) => {
      let inputEl = this.shadowRoot.querySelector(`[name=${inputState.name}]`)
      if (inputEl) inputEl.setProps(inputState)
    })
  }

  fireOnChange(event) {
    this.fireHook('on-change', event)
  }

  fireHook(hook, event) {
    // If locked, don't run any logic.
    if (this.locked) return
    let formEl = this.shadowRoot.querySelector('form')
    // Bail if no matching attribute given the hook called.
    if (!formEl.hasAttribute(hook)) return
    // Prepare some helper variables.
    let state = this.store.getState()
    // Inputs.
    let inputsArray = []
    state.items.forEach(item => inputsArray = [...inputsArray, ...item.inputs])
    this.shadowRoot.querySelectorAll('[name]').forEach(input => inputsArray.push(input))
    let inputsKeyedByName = {}
    inputsArray.forEach(input => inputsKeyedByName[input.name] = input)
    let inputs = inputsKeyedByName
    // Elements.
    let elementsById = {}
    this.shadowRoot.querySelectorAll('[id]').forEach(el => elementsById[el.id] = el)
    // Items.
    let items = {}
    state.items.forEach(item => items[item.name] = item)
    let inputEls = this.shadowRoot.querySelectorAll('[name]')
    let tangyFormStore = this.store
    // Declare namespaces for helper functions for the eval context in form.on-change.
    // We have to do this because bundlers modify the names of things that are imported
    // but do not update the evaled code because it knows not of it.
    let helpers = new TangyFormItemHelpers(this)
    let getValue = (name) => helpers.getValue(name)
    let inputHide = (name) => helpers.inputHide(name)
    let inputShow = (name) => helpers.inputShow(name)
    let inputDisable = (name) => helpers.inputDisable(name)
    let inputEnable = (name) => helpers.inputEnable(name)
    let itemsPerMinute = (input) => helpers.itemsPerMinute(input)
    eval(formEl.getAttribute(hook))
  }

  onOpenButtonPress() {
    this.open = true
    this.dispatchEvent(new CustomEvent('ITEM_OPENED'))
  }

  onCloseButtonPress() {
    if (this.locked) {
      this.open = false
      this.dispatchEvent(new CustomEvent('ITEM_CLOSED'))
    }
    else if (this.validate()) {
      this.submit()
      this.open = false
      this.dispatchEvent(new CustomEvent('ITEM_CLOSED'))
    }
  }

  async onOpenChange(open) {
    // Close it.
    if (open === false) {
      this.$.content.innerHTML = ''
    }
    // Open it, but only if empty because we might be stuck.
    if (open === true && this.$.content.innerHTML === '') {
      let that = this
      const request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          that.$.content.innerHTML = this.responseText
          that.$.content
            .querySelectorAll('[name]')
            .forEach(input => {
              input.addEventListener('change', that.fireOnChange.bind(that))
            })
          that.reflect()
          that.dispatchEvent(new CustomEvent('TANGY_FORM_ITEM_OPENED'))
        }
      }
      request.open('GET', this.src);
      request.send();

    }
    let form = this.shadowRoot.querySelector('form')
    if (open === true && form && form.getAttribute('on-open')) {
      this.fireHook('on-open')
      this.fireHook('on-change')
    }
    this.reflect()
  }

  onDisabledChange(newState, oldState) {
    if (newState === true && oldState === false) {
      this.dispatch({ type: ITEM_DISABLED, itemId: this.id })
    }
  }

  submit() {
    let inputs = []
    this
      .shadowRoot
      .querySelectorAll('[name]')
      .forEach(input => inputs.push(input.getProps()))
    this.inputs = inputs
    if (window.devtools && window.devtools.open) {
      console.table(this.inputs.map(input => { return {name: input.name, value: input.value} }))
    }
    return true
  }



  validate() {
    let inputs = this.shadowRoot.querySelectorAll('[name]')
    let invalidInputNames = []
    let validInputNames = []
    inputs.forEach((input) => {
      if (input.validate && !input.hidden && !input.validate()) {
        invalidInputNames.push(input.name)
      } else {
        validInputNames.push(input.name)
      }
    })
    if (invalidInputNames.length !== 0) {
      this.shadowRoot
        .querySelector(`[name=${invalidInputNames[0]}]`)
        .scrollIntoView({ behavior: 'smooth', block: 'start' })
      this.incomplete = true
      return false
    } else {
      this.incomplete = false
      return true
    }
  }

  next() {
    if (this.validate()) {
      this.submit()
      this.dispatchEvent(new CustomEvent('ITEM_NEXT'))
    }
  }

  back() {
    this.submit()
    this.dispatchEvent(new CustomEvent('ITEM_BACK'))
  }

  clickedComplete() {
    if (this.validate()) {
      this.submit()
      this.dispatchEvent(new CustomEvent('FORM_RESPONSE_COMPLETE', {bubbles: true}))
    }
  }

}

window.customElements.define(TangyFormItem.is, TangyFormItem);
