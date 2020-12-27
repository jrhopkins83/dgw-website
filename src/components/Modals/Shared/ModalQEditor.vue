<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      :value="qeditor"
      min-height="30rem"
      max-height="35rem"
      ref="editor"
      @input="$emit('update:qeditor', $event)"
      :toolbar="[
        ['undo', 'redo'],
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify'],
          },
        'unordered', 'ordered', 'outdent', 'indent',
        ],
        ['bold', 'italic', 'strike', 'underline','token'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7',
            ],
          },
          'removeFormat',
        ],
        ['hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana',
      }"
    >
      <template v-slot:token>
        <q-btn-dropdown
          color="white"
          icon="format_color_text"
          ref="token"
          size="sm"
          :text-color="foreColor"
          dense
          no-caps
          no-wrap
          unelevated
        >
          <q-list dense>
            <q-item
              @click="color('foreColor', foreColor)"
              tag="label"
              clickable
            >
              <q-item-section>
                <q-color
                  v-model="foreColor"
                  :palette="palletteFore"
                  default-view="palette"
                  no-footer
                  no-header
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown
          color="white"
          icon="format_color_fill"
          ref="token"
          size="sm"
          :text-color="highlight"
          dense
          no-caps
          no-wrap
          unelevated
        >
          <q-list dense>
            <q-item
              @click="color('backColor', highlight)"
              tag="label"
              clickable
            >
              <q-item-section side>
                <q-icon name="highlight" />
              </q-item-section>
              <q-item-section>
                <q-color
                  class="my-picker"
                  v-model="highlight"
                  :palette="paletteHighlight"
                  default-view="palette"
                  no-footer
                  no-header
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
    </q-editor>
    <div v-html="editor"></div>
  </div>
</template>

<script>
export default {
  name: 'ModalQEditor',
  props: ['qeditor'],
  data () {
    return {
      paletteHighlight: [
        '#ffccccaa', '#ffe6ccaa', '#ffffccaa', '#ccffccaa',
        '#ccffe6aa', '#ccffffaa', '#cce6ffaa', '#ccccffaa', '#e6ccffaa', '#ffccffaa', '#ff0000aa', '#ff8000aa', '#ffff00aa', '#00ff00aa', '#00ff80aa', '#00ffffaa', '#0080ffaa', '#0000ffaa', '#8000ffaa', '#ff00ffaa'
      ],
      palletteFore: ['#B80000', '#FF0001', '#FFB800', '#FEFF05', '#87C947', '#06A647', '#03A7ED', '#0164B8', '#001D55', '#652A95'],
      foreColor: '#000000',
      highlight: '#ffff00aa',
      editor: 'Select some text,' + ' then select a highlight or text color!'
    }
  },

  methods: {
    color (cmd, name) {
      const edit = this.$refs.editor
      this.$refs.token.hide()
      // edit.caret.restore()
      edit.runCmd(cmd, name)
      edit.focus()
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.q-editor__content {
  min-height: 30rem;
}
</style>
