import React from 'react';

var Loading = React.createClass({
    render: function() {
        return (
            <div className="loading">
                <span>Now Loading…</span>
                <progress />
            </div>
        );
    }
});

export default Loading;
