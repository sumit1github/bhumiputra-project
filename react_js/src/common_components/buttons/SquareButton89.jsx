import React from 'react'

export const SquareButton89 = ({
    label = "no label",
    onclickFunction = {},
    style = {},
}) => {
    return (
        <>
            <style>
                {`
                    .button-89 {
                        --b: 3px;   /* border thickness */
                        --s: .45em; /* size of the corner */
                        --color: #ffffff;
                        
                        padding: calc(.5em + var(--s)) calc(.9em + var(--s));
                        color: var(--color);
                        --_p: var(--s);
                        background:
                            conic-gradient(from 90deg at var(--b) var(--b),#0000 90deg,var(--color) 0)
                            var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));
                        transition: .3s linear, color 0s, background-color 0s;
                        outline: var(--b) solid #0000;
                        outline-offset: .6em;
                        font-size: 16px;

                        border: 0;

                        user-select: none;
                        -webkit-user-select: none;
                        touch-action: manipulation;
                    }

                    .button-89:hover,
                    .button-89:focus-visible{
                        --_p: 0px;
                        outline-color: var(--color);
                        outline-offset: .05em;
                    }

                    .button-89:active {
                        background: var(--color);
                        color: #fff;
                    }
                `}
            </style>

            <button style={style} className="button-89" role="button" onClick={onclickFunction}>{label}</button>

        </>
    )
}
