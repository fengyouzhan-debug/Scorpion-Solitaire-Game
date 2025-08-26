// Tailwind 配置
window.tailwind = window.tailwind || {};
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#16a34a',          //主色（绿色）游戏按钮 / 胜利动画等
        secondary: '#0f172a',       //深色背景/文字
        accent: '#dc2626',         //	高亮/警告/错误（红色）
        neutral: '#f8fafc',       //浅色背景，如卡牌、空堆背景等
        'card-red': '#dc2626',
        'card-black': '#0f172a',
      },
      fontFamily: {          // 添加了 font-inter 类可用，指向 Inter 字体
        inter: ['Inter', 'sans-serif'],
      },
    },
  }
};

// 自定义 TailwindCSS 样式（可选导出，便于后续处理）
window.customTailwindStyle = `
@layer utilities {
  .content-auto {
    content-visibility: auto;  
  }
  .card-shadow {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .card-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .pile-transition {
    transition: all 0.3s ease;
  }
  .btn-pulse {
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(22, 163, 74, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
    }
  }
}
`; 

