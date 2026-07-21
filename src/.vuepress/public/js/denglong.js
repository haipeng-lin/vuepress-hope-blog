/**
 * 节日灯笼挂件 - 兼容 VitePress 生产环境版
 */

// 创建并添加元素
function createDengContainer() {
    // 防止重复创建
    if (document.querySelector('.deng-container')) return;

    const container = document.createElement('div');
    container.className = 'deng-container';
 
    // --- 兼容性获取文本逻辑 ---
    let customText = null;

    // 优先从全局变量获取 (针对 VitePress 优化)
    if (window.DENG_CONFIG && window.DENG_CONFIG.text) {
        customText = window.DENG_CONFIG.text;
    } 
    // 备选：从 URL 参数获取 (兼容普通脚本引入)
    else if (document.currentScript && document.currentScript.src) {
        const scriptSrc = document.currentScript.src;
        if (scriptSrc.includes('?')) {
            const urlParams = new URLSearchParams(scriptSrc.split('?')[1]);
            customText = urlParams.get('text');
        }
    }
 
    const texts = customText ? customText.split('') : ['新', '年', '快', '乐'];
 
    texts.forEach((text, index) => {
        const box = document.createElement('div');
        // 限制最多显示 4 个，防止手机端重叠严重
        if (index >= 4) return;
        
        box.className = `deng-box deng-box${index + 1}`;
 
        const deng = document.createElement('div');
        deng.className = 'deng';
 
        const xian = document.createElement('div');
        xian.className = 'xian';
 
        const dengA = document.createElement('div');
        dengA.className = 'deng-a';
 
        const dengB = document.createElement('div');
        dengB.className = 'deng-b';
 
        const dengT = document.createElement('div');
        dengT.className = 'deng-t';
        dengT.textContent = text;
 
        dengB.appendChild(dengT);
        dengA.appendChild(dengB);
        deng.appendChild(xian);
        deng.appendChild(dengA);
 
        const shuiA = document.createElement('div');
        shuiA.className = 'shui shui-a';
 
        const shuiC = document.createElement('div');
        shuiC.className = 'shui-c';
        const shuiB = document.createElement('div');
        shuiB.className = 'shui-b';
 
        shuiA.appendChild(shuiC);
        shuiA.appendChild(shuiB);
        deng.appendChild(shuiA);
        box.appendChild(deng);
        container.appendChild(box);
    });
 
    document.body.appendChild(container);
}
 
// 添加 CSS 样式
function addStyles() {
    if (document.getElementById('deng-style')) return;
    
    const style = document.createElement('style');
    style.id = 'deng-style';
    style.type = 'text/css';
    style.textContent = `
        .deng-container { position: relative; top: 10px; opacity: 0.9; z-index: 9999; pointer-events: none; }
        .deng-box { position: fixed; top: 40px; }
        .deng-box1 { left: 20px; }
        .deng-box2 { left: 130px; }
        .deng-box3 { right: 130px; }
        .deng-box4 { right: 20px; }
        .deng { position: relative; width: 120px; height: 90px; background: rgba(216, 0, 15, .8); border-radius: 50% 50%; animation: swing 3s infinite ease-in-out; box-shadow: -5px 5px 30px 4px rgba(252, 144, 16, 0.5); }
        .deng-a { width: 100px; height: 90px; background: rgba(216, 0, 15, .1); border-radius: 50%; border: 2px solid #dc8f03; margin-left: 7px; display: flex; justify-content: center; }
        .deng-b { width: 65px; height: 83px; background: rgba(216, 0, 15, .1); border-radius: 60%; border: 2px solid #dc8f03; }
        .xian { position: absolute; top: -50px; left: 60px; width: 2px; height: 50px; background: #dc8f03; }
        .shui-a { position: relative; width: 5px; height: 20px; margin: -5px 0 0 59px; animation: swing 4s infinite ease-in-out; transform-origin: 50% -45px; background: orange; border-radius: 0 0 5px 5px; }
        .shui-b { position: absolute; top: 14px; left: -2px; width: 10px; height: 10px; background: #dc8f03; border-radius: 50%; }
        .shui-c { position: absolute; top: 18px; left: -2px; width: 10px; height: 35px; background: orange; border-radius: 0 0 0 5px; }
        .deng:before, .deng:after { content: " "; display: block; position: absolute; border-radius: 5px; border: solid 1px #dc8f03; background: linear-gradient(to right, #dc8f03, orange, #dc8f03, orange, #dc8f03); }
        .deng:before { top: -7px; left: 29px; height: 12px; width: 60px; z-index: 999; }
        .deng:after { bottom: -7px; left: 10px; height: 12px; width: 60px; margin-left: 20px; }
        .deng-t { font-family: '华文行楷', Arial, sans-serif; font-size: 3.2rem; color: #dc8f03; font-weight: 700; line-height: 85px; text-align: center; }
        @media (max-width: 768px) { 
            .deng-t { font-size: 2.5rem; }  
            .deng-box { transform: scale(0.5); top: -20px; }  
            .deng-box1 { left: -10px; }  
            .deng-box2 { left: 50px; }  
            .deng-box3 { right: 50px; }  
            .deng-box4 { right: -10px; }  
        }
        @keyframes swing { 
            0% { transform: rotate(-10deg); }  
            50% { transform: rotate(10deg); }  
            100% { transform: rotate(-10deg); }  
        }
    `;
    document.head.appendChild(style);
}
 
// 初始化函数
function initDeng() {
    addStyles();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDengContainer);
    } else {
        createDengContainer();
    }
}
 
// 启动
initDeng();