;(function (window) {
    "use strict";

    window.editorSettings = {
        classes: {
            placeholder: 'placeholder',
            image: {
                container: 'medium-insert-images',
                wide: 'medium-insert-images-wide',
                grid: 'medium-insert-images-grid',
                active: 'medium-insert-active',
                activeImg: 'medium-insert-image-active'
            },
            embed: {
                container: 'medium-insert-embeds',
                wide: 'medium-insert-embeds-wide',
                active: 'medium-insert-embeds-selected'
            }
        },
        selectors: {
            media: 'figure'
        },
        sizes: {
            tabletWidth: 768,
            editorWidth: 710,
            floatWidth: 992,
            gridWidth: 1000,
            mediumButtonOffset: 56
        },
        editor: {
            targetBlank: true,
            paste: {
                forcePlainText: true,
                cleanPastedHTML: true,
                cleanReplacements: [],
                cleanAttrs: ['id', 'class', 'style', 'dir', 'color', 'face', 'size', 'align', "border"],
                //List of element tag names to remove during paste when cleanPastedHTML is true
                cleanTags: [
                    'center',
                    'basefont',
                    "frame",
                    "iframe",
                    "frameset",
                    "svg",

                    //Scripting Tags
                    'script',
                    'noscript',

                    //Embedded Content Tags
                    'applet',
                    'area',
                    'audio',
                    'canvas',
                    'embed',
                    'figcaption',
                    'figure',
                    'frame',
                    'img',
                    'map',
                    'noframes',
                    'object',
                    'param',
                    'source',
                    'time',
                    'video',

                    //Form Tags
                    'button',
                    'datalist',
                    'fieldset',
                    'form',
                    'input',
                    'keygen',
                    'label',
                    'legend',
                    'meter',
                    'optgroup',
                    'option',
                    'select',
                    'textarea',

                    // Other HTML tags
                    'abbr',
                    'applet',
                    'area',
                    'audio',
                    'br',
                    'canvas',
                    'datalist',
                    'dialog',
                    'embed',
                    'fieldset',
                    'figcaption',
                    'frameset',
                    'iframe',
                    'main',
                    'menuitem',
                    'picture',
                    'track',
                    'wbr',
                    'var',
                    'ins',
                    'kbd',
                    'mark',
                    'output',
                    'progress',
                    'ruby',
                    'samp',
                    'figure',
                ],
                // List of element tag names to unwrap (remove the element tag but retain its child elements).
                unwrapTags: [
                    'meta', //"Cannot read property 'parentNode' of null" bug

                    // Structural Tags
                    'aside',
                    'article',
                    'body',
                    'details',
                    'div',
                    'span',
                    'h1',
                    'h4',
                    'h5',
                    'h6',
                    'head',
                    'header',
                    'hgroup',
                    'hr',
                    'html',
                    'footer',
                    'nav',
                    'section',
                    'summary',

                    //Metadata Tags
                    'base',
                    'basefont',
                    'link',
                    'meta',
                    'style',
                    'title',

                    //Formatting Tags
                    'blockquote',
                    'acronym',
                    'address',
                    'b',
                    'i',
                    'bdi',
                    'bdo',
                    'big',
                    'center',
                    'cite',
                    'code',
                    'del',
                    'dfn',
                    'em',
                    'font',
                    'pre',
                    'q',
                    'rp',
                    'rt',
                    's',
                    'small',
                    'strike',
                    'sub',
                    'sup',
                    'tt',
                    'u',
                    'strong',

                    //List Tags
                    'dd',
                    'dir',
                    'dl',
                    'dt',
                    'ol',
                    'ul',
                    'li',
                    'menu',

                    //Table Tags
                    'caption',
                    'col',
                    'colgroup',
                    'table',
                    'tbody',
                    'td',
                    'tfoot',
                    'thead',
                    'th',
                    'tr'
                ]
            },
            extensions: {
                fileDragging: {},
                imageDragging: {}
            },
            placeholder: {
                text: 'Tell your story...',
                hideOnClick: false
            },
            toolbar: {
                static: false,
                sticky: false,
                buttons: [
                    {
                        name: 'bold',
                        action: 'bold',
                        aria: 'bold',
                        tagNames: ['b', 'strong'],
                        style: {
                            prop: 'font-weight',
                            value: '700|bold'
                        },
                        useQueryState: true,
                        contentDefault: '<i class="material-icons">format_bold</i>',
                        contentFA: '<i class="material-icons">format_bold</i>'
                    },
                    {
                        name: 'italic',
                        action: 'italic',
                        aria: 'italic',
                        tagNames: ['i', 'em'],
                        style: {
                            prop: 'font-style',
                            value: 'italic'
                        },
                        useQueryState: true,
                        contentDefault: '<i class="material-icons">format_italic</i>',
                        contentFA: '<i class="material-icons">format_italic</i>'
                    },
                    {
                        name: 'anchor',
                        action: 'createLink',
                        aria: 'link',
                        tagNames: ['a'],
                        contentDefault: '<i class="material-icons">link</i>',
                        contentFA: '<i class="material-icons">link</i>'
                    },
                    {
                        name: 'h2',
                        action: 'append-h2',
                        aria: 'Heading',
                        tagNames: ['h1'],
                        contentDefault: '<i class="material-icons">title</i>',
                        contentFA: '<i class="material-icons">title</i>',
                        classList: ['story-heading']
                    },
                    {
                        name: 'h3',
                        action: 'append-h3',
                        aria: 'Subheading',
                        tagNames: ['h3'],
                        contentDefault: '<i class="material-icons">title</i>',
                        contentFA: '<i class="material-icons">title</i>',
                        classList: ['story-sub-heading']
                    },
                    {
                        name: 'quote',
                        action: 'append-blockquote',
                        aria: 'blockquote',
                        tagNames: ['blockquote'],
                        contentDefault: '<i class="material-icons">format_quote</i>',
                        contentFA: '<i class="material-icons">format_quote</i>'
                    },
                    {
                        name: 'unorderedlist',
                        action: 'insertunorderedlist',
                        aria: 'unordered list',
                        tagNames: ['ul'],
                        useQueryState: true,
                        contentDefault: '<i class="material-icons">&#xE241;</i>',
                        contentFA: '<i class="material-icons">&#xE241;</i>'
                    }
                ]
            }
        }
    };


})(window);
