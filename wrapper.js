(function () {
    function bufferToBase64(buffer) {
    	console.log("WRAPPER - 3");
        let binary = "";
        let bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    (function () {
    	console.log("WRAPPER - 13");
        let old = {};
        function wrap(name) {
            console.log("WRAPPER - 16");
            old[name] = WebAssembly[name];
            WebAssembly[name] = function(bufferSource) {
            	console.log("WRAPPER - 19");
                wasmFound(bufferToBase64(bufferSource));
                return old[name].call(WebAssembly, ...arguments);
            };
        }
        wrap("instantiate");
        wrap("compile");
    })();

    WebAssembly.instantiateStreaming = async function(source, importObject) {
    	console.log("WRAPPER - 29");
        let response = await source;
        let body = await response.arrayBuffer();
        return WebAssembly.instantiate(body, importObject);
    };

    WebAssembly.compileStreaming = async function(source) {
    	console.log("WRAPPER - 36");
        let response = await source;
        let body = await response.arrayBuffer();
        return WebAssembly.compile(body);
    };

    const handler = {
        construct(target, args) {
            console.log("WRAPPER - 44");
            wasmFound(bufferToBase64(args[0]));
            return new target(...args);
        }
    };
    WebAssembly.Module = new Proxy(WebAssembly.Module, handler);
})();
