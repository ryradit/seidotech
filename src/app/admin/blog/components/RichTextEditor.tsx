'use client';

import { type Editor, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@tiptap/extension-font-size';
import { useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
  Palette,
} from 'lucide-react';
import tinycolor from 'tinycolor2';
import { Button } from '../../../../components/ui/button';
import { Toggle } from '../../../../components/ui/toggle';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/ui/popover';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuButton = ({ editor, type, icon: Icon, title }: { editor: Editor | null, type: string, icon: any, title: string }) => {
  if (!editor) return null;

  return (
    <Toggle
      size="sm"
      pressed={editor.isActive(type)}
      onPressedChange={() => editor.chain().focus().toggleMark(type).run()}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Toggle>
  );
};

const AlignmentButton = ({ editor, alignment, icon: Icon, title }: { editor: Editor | null, alignment: 'left' | 'center' | 'right' | 'justify', icon: any, title: string }) => {
  if (!editor) return null;

  return (
    <Toggle
      size="sm"
      pressed={editor.isActive({ textAlign: alignment })}
      onPressedChange={() => editor.chain().focus().setTextAlign(alignment).run()}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Toggle>
  );
};

const ListButton = ({ editor, type, icon: Icon, title }: { editor: Editor | null, type: 'bulletList' | 'orderedList', icon: any, title: string }) => {
  if (!editor) return null;

  const toggleList = () => {
    if (type === 'bulletList') {
      if (editor.isActive('orderedList')) {
        editor.chain().focus().toggleOrderedList().toggleBulletList().run();
      } else {
        editor.chain().focus().toggleBulletList().run();
      }
    } else if (type === 'orderedList') {
      if (editor.isActive('bulletList')) {
        editor.chain().focus().toggleBulletList().toggleOrderedList().run();
      } else {
        editor.chain().focus().toggleOrderedList().run();
      }
    }
  };

  return (
    <Toggle
      size="sm"
      pressed={editor.isActive(type)}
      onPressedChange={toggleList}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Toggle>
  );
};

const FontSizeSelect = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const sizes = [
    { label: 'Default', value: 'default' },
    { label: '10px', value: '10px' },
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
    { label: '30px', value: '30px' },
    { label: '36px', value: '36px' },
    { label: '48px', value: '48px' },
  ];

  const currentSize = editor.getAttributes('textStyle').fontSize;

  return (
    <Select
      value={currentSize || 'default'}
      onValueChange={(value) => {
        if (value === 'default') {
          editor.chain().focus().unsetFontSize().run();
        } else {
          editor.chain().focus().setFontSize(value).run();
        }
      }}
    >
      <SelectTrigger className="w-[100px] h-8">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent>
        {sizes.map(size => (
          <SelectItem key={size.value} value={size.value}>
            {size.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const FontFamilySelect = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const fonts = [
    { label: 'Default', value: 'default' },
    { label: 'Abril Fatface', value: 'Abril Fatface' },
    { label: 'Alegreya', value: 'Alegreya' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Arial Black', value: 'Arial Black' },
    { label: 'Baskerville', value: 'Baskerville' },
    { label: 'Bodoni MT', value: 'Bodoni MT' },
    { label: 'Bookman', value: 'Bookman' },
    { label: 'Brush Script MT', value: 'Brush Script MT' },
    { label: 'Calibri', value: 'Calibri' },
    { label: 'Cambria', value: 'Cambria' },
    { label: 'Candara', value: 'Candara' },
    { label: 'Century Gothic', value: 'Century Gothic' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS' },
    { label: 'Consolas', value: 'Consolas' },
    { label: 'Copperplate', value: 'Copperplate' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Didot', value: 'Didot' },
    { label: 'Franklin Gothic', value: 'Franklin Gothic' },
    { label: 'Futura', value: 'Futura' },
    { label: 'Garamond', value: 'Garamond' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Impact', value: 'Impact' },
    { label: 'Josefin Sans', value: 'Josefin Sans' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Lucida Sans', value: 'Lucida Sans' },
    { label: 'Montserrat', value: 'Montserrat' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Optima', value: 'Optima' },
    { label: 'Palatino', value: 'Palatino' },
    { label: 'Playfair Display', value: 'Playfair Display' },
    { label: 'Rockwell', value: 'Rockwell' },
    { label: 'Segoe UI', value: 'Segoe UI' },
    { label: 'Tahoma', value: 'Tahoma' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS' },
    { label: 'Verdana', value: 'Verdana' }
  ];

  return (
    <Select
      value={editor.getAttributes('textStyle').fontFamily || 'default'}
      onValueChange={(value) => {
        if (value === 'default') {
          editor.chain().focus().unsetFontFamily().run();
        } else {
          editor.chain().focus().setFontFamily(value).run();
        }
      }}
    >
      <SelectTrigger className="w-[180px] h-8">
        <SelectValue placeholder="Font family" />
      </SelectTrigger>
      <SelectContent>
        {fonts.map(font => (
          <SelectItem key={font.value} value={font.value}>
            <span style={{ fontFamily: font.value !== 'default' ? font.value : undefined }}>
              {font.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const ColorPicker = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  ];

  const currentColor = editor.getAttributes('textStyle').color;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Toggle
          size="sm"
          pressed={!!currentColor}
          title="Text Color"
        >
          <div className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            {currentColor && (
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: currentColor }}
              />
            )}
          </div>
        </Toggle>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-10 gap-1 p-2">
          {colors.map((color) => (
            <button
              key={color}
              className="h-6 w-6 rounded-md border border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => {
                if (tinycolor(color).toHexString() === '#FFFFFF') {
                  editor.chain().focus().unsetColor().run();
                } else {
                  editor.chain().focus().setColor(color).run();
                }
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize.configure({
        types: ['textStyle'],
        defaultSize: '16px',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'bulletList', 'orderedList'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    immediatelyRender: false,
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content) {
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  const setLink = () => {
    if (!linkUrl) {
      editor?.chain().focus().unsetLink().run();
      return;
    }

    editor?.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setLinkOpen(false);
  };

  return (
    <div className="border rounded-lg">
      {/* Editor Toolbar */}
      <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-2 items-center">
        <div className="flex gap-2 items-center border-r pr-2">
          <FontFamilySelect editor={editor} />
          <FontSizeSelect editor={editor} />
        </div>

        <div className="flex gap-1 items-center border-r pr-2">
          <MenuButton editor={editor} type="bold" icon={Bold} title="Bold" />
          <MenuButton editor={editor} type="italic" icon={Italic} title="Italic" />
          <MenuButton editor={editor} type="underline" icon={UnderlineIcon} title="Underline" />
          <ColorPicker editor={editor} />
        </div>

        <div className="flex gap-1 items-center border-r pr-2">
          <AlignmentButton editor={editor} alignment="left" icon={AlignLeft} title="Align Left" />
          <AlignmentButton editor={editor} alignment="center" icon={AlignCenter} title="Align Center" />
          <AlignmentButton editor={editor} alignment="right" icon={AlignRight} title="Align Right" />
          <AlignmentButton editor={editor} alignment="justify" icon={AlignJustify} title="Justify" />
        </div>

        <div className="flex gap-1 items-center border-r pr-2">
          <ListButton editor={editor} type="bulletList" icon={List} title="Bullet List" />
          <ListButton editor={editor} type="orderedList" icon={ListOrdered} title="Numbered List" />
        </div>

        <div className="flex gap-1 items-center border-r pr-2">
          <Popover open={linkOpen} onOpenChange={setLinkOpen}>
            <PopoverTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor?.isActive('link')}
                title="Add Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Toggle>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setLink()}
                />
                <Button onClick={setLink}>Add</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-1 items-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}