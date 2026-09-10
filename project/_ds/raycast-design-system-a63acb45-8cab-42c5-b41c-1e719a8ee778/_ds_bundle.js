/* @ds-bundle: {"format":4,"namespace":"RaycastDesignSystem_a63acb","components":[{"name":"CommandPaletteCard","sourcePath":"components/cards/CommandPaletteCard.jsx"},{"name":"CommandPaletteRow","sourcePath":"components/cards/CommandPaletteRow.jsx"},{"name":"FeatureCard","sourcePath":"components/cards/FeatureCard.jsx"},{"name":"PricingTierCard","sourcePath":"components/cards/PricingTierCard.jsx"},{"name":"StoreExtensionCard","sourcePath":"components/cards/StoreExtensionCard.jsx"},{"name":"AppIconTile","sourcePath":"components/decorative/AppIconTile.jsx"},{"name":"Keycap","sourcePath":"components/decorative/Keycap.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"PillTab","sourcePath":"components/feedback/PillTab.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"TextInput","sourcePath":"components/forms/TextInput.jsx"},{"name":"HeroStripeBand","sourcePath":"components/hero/HeroStripeBand.jsx"},{"name":"LinkInline","sourcePath":"components/inline/LinkInline.jsx"},{"name":"FooterSection","sourcePath":"components/navigation/FooterSection.jsx"},{"name":"PrimaryNav","sourcePath":"components/navigation/PrimaryNav.jsx"}],"sourceHashes":{"components/cards/CommandPaletteCard.jsx":"767780e0cd20","components/cards/CommandPaletteRow.jsx":"1aaaa7258f55","components/cards/FeatureCard.jsx":"439ec2dbdae2","components/cards/PricingTierCard.jsx":"7e7bf9d3653b","components/cards/StoreExtensionCard.jsx":"8f6bef63089e","components/decorative/AppIconTile.jsx":"b5b952b5e739","components/decorative/Keycap.jsx":"9cbc4c4edde8","components/feedback/Badge.jsx":"ab22999e5cd1","components/feedback/PillTab.jsx":"25c7ce9dff4a","components/forms/Button.jsx":"ff9ce135a423","components/forms/TextInput.jsx":"fd435c26953d","components/hero/HeroStripeBand.jsx":"da6851682e25","components/inline/LinkInline.jsx":"dc3dee0ffb44","components/navigation/FooterSection.jsx":"1652856236e0","components/navigation/PrimaryNav.jsx":"52f7caef54cc","ui_kits/marketing-site/ExtensionDetail.jsx":"cb727ff71854","ui_kits/marketing-site/Home.jsx":"ba52fb486495","ui_kits/marketing-site/Pricing.jsx":"29bf89e55e4b","ui_kits/marketing-site/Store.jsx":"84177d695bf7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RaycastDesignSystem_a63acb = window.RaycastDesignSystem_a63acb || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/CommandPaletteCard.jsx
try { (() => {
function CommandPaletteCard({
  searchValue = '',
  size = 'xl',
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-surface)',
      border: '1px solid var(--color-hairline)',
      borderRadius: size === 'xl' ? 'var(--radius-xl)' : 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 16px',
      borderBottom: '1px solid var(--color-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--color-hairline-strong)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--color-hairline-strong)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--color-hairline-strong)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-md-size)',
      color: 'var(--color-mute)'
    }
  }, searchValue || 'Search for apps and commands...')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: 8
    }
  }, children));
}
Object.assign(__ds_scope, { CommandPaletteCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/CommandPaletteCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/CommandPaletteRow.jsx
try { (() => {
function CommandPaletteRow({
  active = false,
  icon,
  label,
  shortcut
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-md)',
      background: active ? 'var(--color-surface-card)' : 'transparent',
      borderRadius: 'var(--radius-sm)',
      padding: '6px 10px'
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-md-size)',
      color: 'var(--color-on-dark)'
    }
  }, label), shortcut && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      display: 'flex',
      gap: 4
    }
  }, shortcut));
}
Object.assign(__ds_scope, { CommandPaletteRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/CommandPaletteRow.jsx", error: String((e && e.message) || e) }); }

// components/cards/FeatureCard.jsx
try { (() => {
function FeatureCard({
  elevated = false,
  title,
  description,
  media,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: elevated ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
      border: '1px solid var(--color-hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-xl)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)'
    }
  }, media && /*#__PURE__*/React.createElement("div", null, media), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-sm)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-heading-md-size)',
      fontWeight: 'var(--text-heading-md-weight)',
      lineHeight: 'var(--text-heading-md-leading)',
      letterSpacing: 'var(--text-heading-md-tracking)',
      color: 'var(--color-ink)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-sm-size)',
      lineHeight: 'var(--text-body-sm-leading)',
      color: 'var(--color-body)'
    }
  }, description)), action);
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/PricingTierCard.jsx
try { (() => {
function PricingTierCard({
  featured = false,
  name,
  price,
  priceSuffix,
  description,
  features = [],
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: featured ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
      border: '1px solid var(--color-hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-xl)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-heading-xl-size)',
      fontWeight: 'var(--text-heading-xl-weight)',
      color: 'var(--color-ink)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-display)',
      fontSize: 'var(--text-display-lg-size)',
      fontWeight: 'var(--text-display-lg-weight)',
      color: 'var(--color-ink)'
    }
  }, price), priceSuffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm-size)',
      color: 'var(--color-mute)'
    }
  }, priceSuffix)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-lg-size)',
      lineHeight: 'var(--text-body-lg-leading)',
      color: 'var(--color-body)'
    }
  }, description), action, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-sm)'
    }
  }, features.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm-size)',
      color: 'var(--color-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-accent-green)'
    }
  }, "\u2713"), f))));
}
Object.assign(__ds_scope, { PricingTierCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PricingTierCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/StoreExtensionCard.jsx
try { (() => {
function StoreExtensionCard({
  icon,
  name,
  author,
  description,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-lg)',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-hairline)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-heading-sm-size)',
      fontWeight: 'var(--text-heading-sm-weight)',
      color: 'var(--color-ink)'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-caption-md-size)',
      color: 'var(--color-mute)'
    }
  }, "by ", author), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-sm-size)',
      color: 'var(--color-body)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, description)), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action));
}
Object.assign(__ds_scope, { StoreExtensionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/StoreExtensionCard.jsx", error: String((e && e.message) || e) }); }

// components/decorative/AppIconTile.jsx
try { (() => {
function AppIconTile({
  size = 'default',
  children
}) {
  const px = size === 'large' ? 64 : 48;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: px,
      height: px,
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-surface-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0
    }
  }, children);
}
Object.assign(__ds_scope, { AppIconTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/decorative/AppIconTile.jsx", error: String((e && e.message) || e) }); }

// components/decorative/Keycap.jsx
try { (() => {
function Keycap({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 20,
      height: 20,
      padding: '1px 6px',
      borderRadius: 'var(--radius-xs)',
      background: 'linear-gradient(180deg, var(--color-key-bg-start), var(--color-key-bg-end))',
      color: 'var(--color-body)',
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-caption-md-size)'
    }
  }, children);
}
Object.assign(__ds_scope, { Keycap });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/decorative/Keycap.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function Badge({
  variant = 'pro',
  children
}) {
  const styles = variant === 'info' ? {
    background: 'var(--color-accent-blue-soft)',
    color: 'var(--color-accent-blue)',
    padding: '2px 8px'
  } : {
    background: 'var(--color-surface-elevated)',
    color: 'var(--color-on-dark-mute)',
    padding: '2px 6px'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-caption-sm-size)',
      fontWeight: 'var(--text-caption-sm-weight)',
      letterSpacing: 'var(--text-caption-sm-tracking)',
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 'var(--radius-xs)',
      ...styles
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/PillTab.jsx
try { (() => {
function PillTab({
  active = false,
  children,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-sm-size)',
      fontWeight: 'var(--text-body-sm-weight)',
      background: active ? 'var(--color-surface-elevated)' : 'transparent',
      color: active ? 'var(--color-on-dark)' : 'var(--color-body)',
      border: 'none',
      borderRadius: 'var(--radius-full)',
      padding: '4px 10px',
      cursor: 'pointer'
    }
  }, children);
}
Object.assign(__ds_scope, { PillTab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/PillTab.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const {
  useState
} = React;
const VARIANTS = {
  primary: {
    bg: 'var(--color-primary)',
    bgPressed: 'var(--color-primary-pressed)',
    color: 'var(--color-on-primary)',
    border: 'none'
  },
  secondary: {
    bg: 'transparent',
    bgPressed: 'transparent',
    color: 'var(--color-on-dark)',
    border: 'none'
  },
  tertiary: {
    bg: 'var(--color-surface-elevated)',
    bgPressed: 'var(--color-surface-elevated)',
    color: 'var(--color-on-dark)',
    border: 'none'
  },
  install: {
    bg: 'transparent',
    bgPressed: 'transparent',
    color: 'var(--color-on-dark)',
    border: '1px solid var(--color-hairline-strong)'
  }
};
function Button({
  variant = 'primary',
  disabled = false,
  children,
  onClick,
  style
}) {
  const [pressed, setPressed] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const padding = variant === 'install' ? '6px 14px' : '8px 16px';
  const height = variant === 'install' ? 32 : 36;
  return /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    disabled: disabled,
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-button-md-size)',
      fontWeight: 'var(--text-button-md-weight)',
      lineHeight: 'var(--text-button-md-leading)',
      letterSpacing: 'var(--text-button-md-tracking)',
      background: disabled ? 'var(--color-surface-elevated)' : pressed ? v.bgPressed : v.bg,
      color: disabled ? 'var(--color-ash)' : v.color,
      border: v.border,
      borderRadius: 'var(--radius-md)',
      padding,
      height,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      whiteSpace: 'nowrap',
      transition: 'background 0.1s ease',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextInput.jsx
try { (() => {
const {
  useState
} = React;
function TextInput({
  variant = 'default',
  placeholder = '',
  value,
  onChange,
  icon
}) {
  const [focused, setFocused] = useState(false);
  const isSearch = variant === 'search';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      color: 'var(--color-mute)',
      display: 'flex',
      pointerEvents: 'none'
    }
  }, icon), /*#__PURE__*/React.createElement("input", {
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-md-size)',
      fontWeight: 'var(--text-body-md-weight)',
      lineHeight: 'var(--text-body-md-leading)',
      background: 'var(--color-surface-elevated)',
      color: 'var(--color-on-dark)',
      border: `1px solid ${focused ? 'var(--color-hairline-strong)' : 'var(--color-hairline)'}`,
      borderRadius: 'var(--radius-md)',
      padding: isSearch ? '10px 16px' : '8px 12px',
      paddingLeft: icon ? 40 : isSearch ? 16 : 12,
      height: isSearch ? 44 : 36,
      width: '100%',
      outline: 'none',
      boxSizing: 'border-box'
    }
  }));
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/hero/HeroStripeBand.jsx
try { (() => {
function HeroStripeBand({
  title,
  subtitle,
  action,
  media
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--color-canvas)',
      padding: 'var(--space-section) 48px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 280,
      background: 'repeating-linear-gradient(115deg, var(--color-hero-stripe-start) 0px, var(--color-hero-stripe-start) 40px, var(--color-hero-stripe-end) 40px, var(--color-hero-stripe-end) 80px, transparent 80px, transparent 220px)',
      opacity: 0.5,
      maskImage: 'linear-gradient(to bottom, black, transparent)',
      WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-lg)',
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-display)',
      fontSize: 'var(--text-display-xl-size)',
      fontWeight: 'var(--text-display-xl-weight)',
      lineHeight: 'var(--text-display-xl-leading)',
      color: 'var(--color-ink)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-lg-size)',
      lineHeight: 'var(--text-body-lg-leading)',
      color: 'var(--color-body)'
    }
  }, subtitle), action), media && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, media));
}
Object.assign(__ds_scope, { HeroStripeBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/hero/HeroStripeBand.jsx", error: String((e && e.message) || e) }); }

// components/inline/LinkInline.jsx
try { (() => {
const {
  useState
} = React;
function LinkInline({
  href = '#',
  children
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-link-md-size)',
      fontWeight: 'var(--text-link-md-weight)',
      letterSpacing: 'var(--text-link-md-tracking)',
      color: 'var(--color-on-dark)',
      textDecoration: hover ? 'underline' : 'none'
    }
  }, children);
}
Object.assign(__ds_scope, { LinkInline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/inline/LinkInline.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FooterSection.jsx
try { (() => {
function FooterSection({
  brand = 'Raycast',
  columns = []
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--color-canvas)',
      borderTop: '1px solid var(--color-hairline)',
      padding: '64px 48px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xxl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns.length || 6}, minmax(0,1fr))`,
      gap: 'var(--space-xl)'
    }
  }, columns.map((col, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-sm-strong-size)',
      fontWeight: 'var(--text-body-sm-strong-weight)',
      color: 'var(--color-on-dark)'
    }
  }, col.title), col.links.map((l, j) => /*#__PURE__*/React.createElement("a", {
    key: j,
    href: l.href,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm-size)',
      color: 'var(--color-body)',
      textDecoration: 'none'
    }
  }, l.label))))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'var(--space-xl)',
      borderTop: '1px solid var(--color-hairline)',
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-strong-size)',
      fontWeight: 600,
      color: 'var(--color-on-dark)'
    }
  }, brand));
}
Object.assign(__ds_scope, { FooterSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FooterSection.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PrimaryNav.jsx
try { (() => {
function PrimaryNav({
  brand = 'Raycast',
  links = [],
  onSignIn,
  ctaLabel = 'Download',
  onCta
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      padding: '0 24px',
      background: 'var(--color-canvas)',
      borderBottom: '1px solid var(--color-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-strong-size)',
      fontWeight: 600,
      color: 'var(--color-on-dark)'
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-xl)'
    }
  }, links.map((l, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: l.href,
    style: {
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-body-sm-strong-size)',
      fontWeight: 'var(--text-body-sm-strong-weight)',
      color: 'var(--color-on-dark)',
      textDecoration: 'none'
    }
  }, l.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-lg)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: onSignIn,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm-strong-size)',
      color: 'var(--color-on-dark)',
      cursor: 'pointer',
      textDecoration: 'none'
    }
  }, "Sign in"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    onClick: onCta
  }, ctaLabel)));
}
Object.assign(__ds_scope, { PrimaryNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PrimaryNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/ExtensionDetail.jsx
try { (() => {
const {
  PrimaryNav,
  FooterSection,
  Button,
  Badge,
  AppIconTile
} = window.RaycastDesignSystem_a63acb;
const DETAIL_FOOTER_COLUMNS = [{
  title: 'Product',
  links: [{
    label: 'Download',
    href: '#'
  }]
}, {
  title: 'Core Features',
  links: [{
    label: 'AI',
    href: '#'
  }]
}, {
  title: 'Top Extensions',
  links: [{
    label: 'Hacker News',
    href: '#'
  }]
}, {
  title: 'Company',
  links: [{
    label: 'About',
    href: '#'
  }]
}, {
  title: 'Community',
  links: [{
    label: 'Slack Community',
    href: '#'
  }]
}, {
  title: 'By Raycast',
  links: [{
    label: 'Ray',
    href: '#'
  }]
}];
function ExtensionDetail({
  extension,
  onBack
}) {
  const ext = extension || {
    name: 'Hacker News',
    author: 'thomas',
    description: 'Browse Hacker News stories and comments.'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-canvas)',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrimaryNav, {
    ctaLabel: "Download"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '96px 48px 96px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xl)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: onBack,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm-size)',
      color: 'var(--color-mute)',
      cursor: 'pointer'
    }
  }, "\u2190 Back to Store"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-lg)'
    }
  }, /*#__PURE__*/React.createElement(AppIconTile, {
    size: "large"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-default)',
      fontSize: 'var(--text-heading-xl-size)',
      fontWeight: 'var(--text-heading-xl-weight)',
      color: 'var(--color-ink)'
    }
  }, ext.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "pro"
  }, "Free")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-caption-md-size)',
      color: 'var(--color-mute)'
    }
  }, "by ", ext.author)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "install"
  }, "Install Extension"))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 640,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-lg-size)',
      lineHeight: 'var(--text-body-lg-leading)',
      color: 'var(--color-body)'
    }
  }, ext.description), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-surface)',
      border: '1px solid var(--color-hairline)',
      borderRadius: 'var(--radius-lg)',
      height: 360,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm-size)',
      color: 'var(--color-stone)'
    }
  }, "Extension screenshot placeholder")), /*#__PURE__*/React.createElement(FooterSection, {
    columns: DETAIL_FOOTER_COLUMNS
  }));
}
window.ExtensionDetail = ExtensionDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/ExtensionDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Home.jsx
try { (() => {
const {
  PrimaryNav,
  FooterSection,
  HeroStripeBand,
  Button,
  LinkInline,
  FeatureCard,
  CommandPaletteCard,
  CommandPaletteRow,
  AppIconTile,
  Keycap
} = window.RaycastDesignSystem_a63acb;
const NAV_LINKS = [{
  label: 'Pro',
  href: '#'
}, {
  label: 'AI',
  href: '#'
}, {
  label: 'Store',
  href: '#'
}, {
  label: 'Manual',
  href: '#'
}, {
  label: 'Changelog',
  href: '#'
}, {
  label: 'Blog',
  href: '#'
}, {
  label: 'Pricing',
  href: '#'
}];
const FOOTER_COLUMNS = [{
  title: 'Product',
  links: [{
    label: 'Download',
    href: '#'
  }, {
    label: 'Pro',
    href: '#'
  }, {
    label: 'Store',
    href: '#'
  }]
}, {
  title: 'Core Features',
  links: [{
    label: 'AI',
    href: '#'
  }, {
    label: 'Clipboard History',
    href: '#'
  }, {
    label: 'Snippets',
    href: '#'
  }]
}, {
  title: 'Top Extensions',
  links: [{
    label: 'Hacker News',
    href: '#'
  }, {
    label: 'Slack',
    href: '#'
  }, {
    label: 'Linear',
    href: '#'
  }]
}, {
  title: 'Company',
  links: [{
    label: 'About',
    href: '#'
  }, {
    label: 'Careers',
    href: '#'
  }]
}, {
  title: 'Community',
  links: [{
    label: 'Slack Community',
    href: '#'
  }, {
    label: 'Twitter',
    href: '#'
  }]
}, {
  title: 'By Raycast',
  links: [{
    label: 'Ray',
    href: '#'
  }]
}];
function Home({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-canvas)',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrimaryNav, {
    links: NAV_LINKS,
    ctaLabel: "Download"
  }), /*#__PURE__*/React.createElement(HeroStripeBand, {
    title: "Your shortcut to everything",
    subtitle: "Raycast is a blazingly fast, totally extensible launcher. Control your tools with a few keystrokes.",
    action: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary"
    }, "Download"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => onNavigate('store')
    }, "Explore the Store")),
    media: /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 640
      }
    }, /*#__PURE__*/React.createElement(CommandPaletteCard, null, /*#__PURE__*/React.createElement(CommandPaletteRow, {
      active: true,
      icon: /*#__PURE__*/React.createElement(AppIconTile, null),
      label: "Clipboard History",
      shortcut: /*#__PURE__*/React.createElement(Keycap, null, "\u2318V")
    }), /*#__PURE__*/React.createElement(CommandPaletteRow, {
      icon: /*#__PURE__*/React.createElement(AppIconTile, null),
      label: "Search Files",
      shortcut: /*#__PURE__*/React.createElement(Keycap, null, "\u23CE")
    }), /*#__PURE__*/React.createElement(CommandPaletteRow, {
      icon: /*#__PURE__*/React.createElement(AppIconTile, null),
      label: "Hacker News",
      shortcut: /*#__PURE__*/React.createElement(Keycap, null, "\u2318K")
    }), /*#__PURE__*/React.createElement(CommandPaletteRow, {
      icon: /*#__PURE__*/React.createElement(AppIconTile, null),
      label: "Create Quicklink"
    })))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '0 48px 96px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(FeatureCard, {
    title: "Quicklinks",
    description: "Turn any URL, file, or script into a command you can trigger instantly.",
    action: /*#__PURE__*/React.createElement(LinkInline, {
      href: "#"
    }, "Learn more \u2192")
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    elevated: true,
    title: "Snippets",
    description: "Store and reuse frequently used text with a short keyword.",
    action: /*#__PURE__*/React.createElement(LinkInline, {
      href: "#"
    }, "Learn more \u2192")
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    title: "AI Chat",
    description: "Ask questions, get answers, and automate tasks without leaving your keyboard.",
    action: /*#__PURE__*/React.createElement(LinkInline, {
      href: "#"
    }, "Learn more \u2192")
  })), /*#__PURE__*/React.createElement(FooterSection, {
    columns: FOOTER_COLUMNS
  }));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Pricing.jsx
try { (() => {
const {
  PrimaryNav,
  FooterSection,
  Button,
  PricingTierCard
} = window.RaycastDesignSystem_a63acb;
const PRICING_FOOTER_COLUMNS = [{
  title: 'Product',
  links: [{
    label: 'Download',
    href: '#'
  }]
}, {
  title: 'Core Features',
  links: [{
    label: 'AI',
    href: '#'
  }]
}, {
  title: 'Top Extensions',
  links: [{
    label: 'Hacker News',
    href: '#'
  }]
}, {
  title: 'Company',
  links: [{
    label: 'About',
    href: '#'
  }]
}, {
  title: 'Community',
  links: [{
    label: 'Slack Community',
    href: '#'
  }]
}, {
  title: 'By Raycast',
  links: [{
    label: 'Ray',
    href: '#'
  }]
}];
function Pricing() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-canvas)',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrimaryNav, {
    ctaLabel: "Download"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '96px 48px 0'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-display)',
      fontSize: 'var(--text-display-lg-size)',
      fontWeight: 'var(--text-display-lg-weight)',
      color: 'var(--color-ink)'
    }
  }, "Pricing")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '32px 48px 96px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(PricingTierCard, {
    name: "Free",
    price: "$0",
    description: "Get started with Raycast's core commands.",
    features: ['Core commands', 'Community extensions', '1 Cloud Sync device'],
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "Download")
  }), /*#__PURE__*/React.createElement(PricingTierCard, {
    featured: true,
    name: "Pro",
    price: "$8",
    priceSuffix: "/month",
    description: "For power users who want it all.",
    features: ['Unlimited AI', 'Unlimited Cloud Sync', 'Custom themes', 'Translation'],
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "primary"
    }, "Get Pro")
  }), /*#__PURE__*/React.createElement(PricingTierCard, {
    name: "Advanced AI",
    price: "$20",
    priceSuffix: "/month",
    description: "Every model, every provider, no limits.",
    features: ['Everything in Pro', 'Claude, GPT-4, Gemini', 'Priority support'],
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "Get Advanced AI")
  })), /*#__PURE__*/React.createElement(FooterSection, {
    columns: PRICING_FOOTER_COLUMNS
  }));
}
window.Pricing = Pricing;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Pricing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Store.jsx
try { (() => {
const {
  PrimaryNav,
  FooterSection,
  TextInput,
  PillTab,
  Button,
  StoreExtensionCard,
  AppIconTile
} = window.RaycastDesignSystem_a63acb;
const {
  useState
} = React;
const EXTENSIONS = [{
  name: 'Hacker News',
  author: 'thomas',
  description: 'Browse Hacker News stories and comments.'
}, {
  name: 'Slack',
  author: 'raycast',
  description: 'Check unread messages and set your Slack status.'
}, {
  name: 'Linear',
  author: 'raycast',
  description: 'Create and manage Linear issues.'
}, {
  name: 'Spotify Player',
  author: 'mattisssa',
  description: 'Control Spotify playback from anywhere.'
}, {
  name: 'Notion',
  author: 'raycast',
  description: 'Search and create Notion pages.'
}, {
  name: 'Figma File Search',
  author: 'raycast',
  description: 'Search your recent Figma files.'
}];
const STORE_FOOTER_COLUMNS = [{
  title: 'Product',
  links: [{
    label: 'Download',
    href: '#'
  }]
}, {
  title: 'Core Features',
  links: [{
    label: 'AI',
    href: '#'
  }]
}, {
  title: 'Top Extensions',
  links: [{
    label: 'Hacker News',
    href: '#'
  }]
}, {
  title: 'Company',
  links: [{
    label: 'About',
    href: '#'
  }]
}, {
  title: 'Community',
  links: [{
    label: 'Slack Community',
    href: '#'
  }]
}, {
  title: 'By Raycast',
  links: [{
    label: 'Ray',
    href: '#'
  }]
}];
function Store({
  onOpenExtension
}) {
  const [tab, setTab] = useState('All Extensions');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-canvas)',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement(PrimaryNav, {
    ctaLabel: "Download"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '96px 48px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xl)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontFeatureSettings: 'var(--font-feature-display)',
      fontSize: 'var(--text-display-lg-size)',
      fontWeight: 'var(--text-display-lg-weight)',
      color: 'var(--color-ink)'
    }
  }, "Store"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement(TextInput, {
    variant: "search",
    placeholder: "Search the store..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, ['All Extensions', 'Recently Added', 'Most Popular'].map(t => /*#__PURE__*/React.createElement(PillTab, {
    key: t,
    active: tab === t,
    onClick: () => setTab(t)
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '32px 48px 96px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 16
    }
  }, EXTENSIONS.map(ext => /*#__PURE__*/React.createElement("div", {
    key: ext.name,
    onClick: () => onOpenExtension(ext),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(StoreExtensionCard, {
    icon: /*#__PURE__*/React.createElement(AppIconTile, null),
    name: ext.name,
    author: ext.author,
    description: ext.description,
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "install"
    }, "Install Extension")
  })))), /*#__PURE__*/React.createElement(FooterSection, {
    columns: STORE_FOOTER_COLUMNS
  }));
}
window.Store = Store;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Store.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CommandPaletteCard = __ds_scope.CommandPaletteCard;

__ds_ns.CommandPaletteRow = __ds_scope.CommandPaletteRow;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.PricingTierCard = __ds_scope.PricingTierCard;

__ds_ns.StoreExtensionCard = __ds_scope.StoreExtensionCard;

__ds_ns.AppIconTile = __ds_scope.AppIconTile;

__ds_ns.Keycap = __ds_scope.Keycap;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.PillTab = __ds_scope.PillTab;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.HeroStripeBand = __ds_scope.HeroStripeBand;

__ds_ns.LinkInline = __ds_scope.LinkInline;

__ds_ns.FooterSection = __ds_scope.FooterSection;

__ds_ns.PrimaryNav = __ds_scope.PrimaryNav;

})();
