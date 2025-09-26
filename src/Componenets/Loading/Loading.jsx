import React from 'react'

const Loading = () => {
    return (
        <div className="w-full h-2 bg-olive-100 overflow-hidden">
            <div className="h-2 bg-olive-500 animate-[loading_1.5s_linear_infinite]" />
            <style>
                {`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
            </style>
        </div>
    );
}

export default Loading