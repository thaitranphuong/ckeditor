import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./App.css";

function App() {
  const [data, setData] = useState("");
  const htmlContent = { __html: data };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("main_image", file);
            fetch(`http://localhost:8080/save2`, {
              method: "POST",
              body: body,
            })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: `http://localhost:8080/getimage/${res.name}`,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div className="App" id="app">
      {/* Phần nội dung */}
      <div className="textarea">
        <CKEditor
          config={{
            extraPlugins: [uploadPlugin],
          }}
          editor={ClassicEditor}
          data={data}
          onChange={(event, editor) => {
            const newData = editor.getData();
            console.log(newData);
            setData(newData);
          }}
        />
      </div>
      {/* Phần hiển thị */}
      <div className="display">
        <div dangerouslySetInnerHTML={htmlContent} />
      </div>
    </div>
  );
}

export default App;
