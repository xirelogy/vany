import { Component } from 'vue';

/**
 * Simple alias for a component pointing to a SVG (icon)
 */
type SvgComponent = Component;


/**
 * Common icons required
 */
export interface VanyCommonIcons {
  Success: SvgComponent;
  Warning: SvgComponent;
  Danger: SvgComponent;
  Info: SvgComponent;

  Yes: SvgComponent;
  No: SvgComponent;

  Plus: SvgComponent;
  Minus: SvgComponent;
  ZoomIn: SvgComponent;
  ZoomOut: SvgComponent;

  ArrowLeft: SvgComponent;
  ArrowRight: SvgComponent;
  ArrowTop: SvgComponent;
  ArrowBottom: SvgComponent;
  ArrowTopLeft: SvgComponent;
  ArrowTopRight: SvgComponent;
  ArrowBottomLeft: SvgComponent;
  ArrowBottomRight: SvgComponent;

  SingleLeft: SvgComponent;
  SingleRight: SvgComponent;
  DoubleLeft: SvgComponent;
  DoubleRight: SvgComponent;

  IndentLeft: SvgComponent;
  IndentRight: SvgComponent;

  Visible: SvgComponent;
  Invisible: SvgComponent;

  Lock: SvgComponent;
  Unlock: SvgComponent;

  Entry: SvgComponent;
  Exit: SvgComponent;

  Upload: SvgComponent;
  Download: SvgComponent;

  Close: SvgComponent;
  More: SvgComponent;
  Move: SvgComponent;
  Edit: SvgComponent;
  Cut: SvgComponent;
  Copy: SvgComponent;
  Delete: SvgComponent;
  Search: SvgComponent;

  Image: SvgComponent;
  Calendar: SvgComponent;
  Clock: SvgComponent;
  Location: SvgComponent;
  Link: SvgComponent;
  Power: SvgComponent;

  Star: SvgComponent;
  StarFill: SvgComponent;

  SettingsGear: SvgComponent;
  SettingsSlide: SvgComponent;

  Bell: SvgComponent;
  Chat: SvgComponent;
  ChatDots: SvgComponent;
  ChatLines: SvgComponent;
  Envelope: SvgComponent;
  Paperclip: SvgComponent;
  Share: SvgComponent;

  Folder: SvgComponent;
  FolderOpen: SvgComponent;
  FolderPlus: SvgComponent;
  FolderMinus: SvgComponent;
  FolderDelete: SvgComponent;
}