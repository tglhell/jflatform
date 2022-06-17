(function() {
  // const API_HEAD = import.meta.env.VITE_SERVER_PORT || '';

  const API_HEAD = 'http://localhost:7386'

  const ENDPOINTS = {
    UPLOAD_ALLOC: API_HEAD + '/api/upload/upload-alloc',
    UPLOAD: API_HEAD + '/api/upload',
    UPLOAD_FIN: API_HEAD + '/api/upload/upload-fin',
    AUTH: API_HEAD + '/api/upload/auth',
  };

  const FILE_STATUS = {
    UPLOADING: 'uploading',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    ERROR: 'error'
  };

  const SIZE_UNITS = ['b', 'K', 'M', 'G', 'T', 'P'];
  const getSize = (value, unit) => value < 1024 ? value.toLocaleString() + (unit || 'b') : getSize(Math.floor(value / 1024), SIZE_UNITS[SIZE_UNITS.indexOf(unit || 'b') + 1]);

  const $container = $('.upload-container'),
    $fileButton = $('.upload-container td.upload-guide .upload-guide-txt'), // 220524 수정
    $fileAddButton = $('.button-add-file'),
    $fileDeleteButton = $('.upload-delete-line'),
    $uploadResetButton = $('.upload-delete-all'),
    $fileInput = $('.upload-container div.button-container input[type=file]'),
    $uploadButton = $('.upload-container .upload-start');

  const fileDatas = new Array($container.length).fill(0)
    .map((container, i) => $container.eq(i).data('uploadId')).reduce((acc, cur) => {
      return {...acc,
        [cur]: {
          fileStat: new Map(),
          curFileIdx: null,
          lastUploadedFileIdx: null,
          uploadAll: false,
          upFiles: [],
          container: $(`.upload-container[data-upload-id=${cur}]`),
          uploadList: $(`.upload-container[data-upload-id=${cur}] tbody`),
        }}
    }, {});

  $fileButton.on('dblclick', (e) => { // 220525 수정
    e.stopPropagation();
    $(e.currentTarget).parents('.upload-container').eq(0).find('div.button-container input[type=file]').click();
  });

  $fileAddButton.on('click', (e) => {
    e.stopPropagation();
    $(e.target).parents('.upload-container').eq(0).find('div.button-container input[type=file]').click();
  });

  $fileInput.on('change', ({target}) => {
    const uploadId = $(target).parents('.upload-container').data('uploadId');
    const file = target.files[0];
    const fd = fileDatas[uploadId];

    if(file){
      const addFiles = [];

      if (!fd.upFiles.some(f => f.name === file.name)) {
        fd.upFiles.push(file);
        addFiles.push(file);
      }

      if (addFiles.length) {
        fd.curFileIdx = fd.lastUploadedFileIdx === null ? 0 : fd.lastUploadedFileIdx + 1;
        // uploadSingleFile();
        showFile(uploadId, addFiles);
        $fileDeleteButton.attr("disabled", false); // Front 화면에서 추가
        $uploadResetButton.attr("disabled", false); // Front 화면에서 추가
      }
    }
  });

  $container.on("dragover", (e) => {
    e.preventDefault();
    $(e.currentTarget).addClass('over');
  });

  $container.on("dragleave", (e) => {
    e.preventDefault();
    if ($(e.relatedTarget).parents('.upload-container').length === 0)
      $(e.currentTarget).removeClass('over');
  });

  $container.on("drop", (e) => {
    e.preventDefault();
    $(e.currentTarget).removeClass('over');

    const uploadId = $(e.currentTarget).data('uploadId');
    const files = e.originalEvent.dataTransfer.files;
    const fd = fileDatas[uploadId];

    const addFiles = [];

    for (const [, value] of Object.entries(files)) {
      if (!fd.upFiles.length) {
        fd.upFiles.push(value);
        addFiles.push(value);
        $fileDeleteButton.attr("disabled", false); // Front 화면에서 추가
        $uploadResetButton.attr("disabled", false); // Front 화면에서 추가
      } else {
        if (!fd.upFiles.some(f => f.name === value.name)) {
          fd.upFiles.push(value);
          addFiles.push(value);
        }
      }
    }

    if (addFiles.length) {
      fd.curFileIdx = fd.lastUploadedFileIdx === null ? 0 : fd.lastUploadedFileIdx + 1;
      // uploadSingleFile();
      showFile(uploadId, addFiles);
    }
  });

  function getFileExtension(file) {
    const sp = file.name.split('.');
    const ext = sp.length > 1 ? sp.reverse()[0] : '';
    return ext;
  }

  function uploadSingleFileChunks(file, options, uploadId) {
    console.log('UploadSingleChunk begin');
    const curChunkIdx = options.uploaded === 0 ? 0 : ((Math.ceil(file.size / options.chunkSize)) - 1) - ((Math.ceil((file.size - options.uploaded) / options.chunkSize)) - 1);
    const fd = fileDatas[uploadId];

    function chunkloop(curChunkIdx) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const offset = curChunkIdx * parseInt(options.chunkSize);
        const endOffset = Math.min(file.size, offset + parseInt(options.chunkSize));
        const slice = file.slice(offset, endOffset); // Blob >> FileReader.readAsArrayBuffer(Blob); >> Uint8Array

        reader.addEventListener('load', (e) => {
          const data = e.target.result;
          const params = new URLSearchParams();
          params.set('sessionId', options.sessionId);
          params.set('fileId', options.fileId);
          params.set('name', file.name);
          params.set('size', file.size);
          params.set('currentChunkIndex', curChunkIdx);
          params.set('totalChunks', Math.ceil(file.size / parseInt(options.chunkSize)));
          const url = options.url + '?' + params.toString();

          const config = {
            headers: {'Content-Type': 'application/octet-stream'},
            onUploadProgress: () => {
              const loaded = e.loaded;
              options.onProgress({
                ...e,
                loaded,
                total: file.size,
                percentage: loaded * 100 / file.size,
                curChunkIdx: curChunkIdx,
              }, file);
            },
            signal: options.controller.signal,
          }

          // TODO: write
          axios.post(url, data, config)
            .then(res => {
              const data = {
                ...res.data,
                fileName: file.name,
                fileId: options.fileId,
                sessionId: options.sessionId,
              }

              const chunks = Math.ceil(file.size / parseInt(options.chunkSize)) - 1;
              const isLastChunk = curChunkIdx === chunks;
              console.log({isLastChunk, curChunkIdx, chunks});

              if (isLastChunk) {
                // TODO : fin
                return axios.put(ENDPOINTS.UPLOAD_FIN, data)
                  .then((res) => {
                    file.finalFileName = res.data.message;
                    options.onComplete(e, file);
                    console.log(fd.upFiles.indexOf(file) + ' is 100% uploaded');
                    fd.lastUploadedFileIdx = fd.curFileIdx;
                    resolve('Upload Done');
                  }).catch(err => {
                    console.log('Error', err);
                    reject('Error Occurred');
                  });
              } else {
                file.curChunkIdx = curChunkIdx;
                chunkloop(curChunkIdx + 1).then((res) => {
                  resolve('Still Uploading');
                });
              }
            }).catch(err => {
            if (options.controller.signal) {
              console.log('Upload aborted');
              options.onAbort(e, file);
            } else {
              console.log('Error', err.message);
              options.onError(e, file);
            }
          });
        });
        reader.readAsDataURL(slice);
      })
    }
    return chunkloop(curChunkIdx);
  }

  const uploadSingleFile = async (fileIdx, uploadId) => {
    console.log('uploadingSingleFile begin');
    const fd = fileDatas[uploadId];
    const file = fd.upFiles[fileIdx];
    const fileObj = fd.fileStat.get(file);
    const $list = $(`.upload-container[data-upload-id=${uploadId}] tbody`);

    console.log(`SIZE: ${file.size}`, `FILENAME: ${file.name}`, `FILETYPE: ${file.type}`);

    let options = !fileObj ? {
      url: ENDPOINTS.UPLOAD,
      sessionId: '',
      fileId: '',
      name: file.name,
      status: '',
      size: file.size,
      percentage: 0,
      uploadedChunkSize: 0,
      tmpFileName: '',
      curChunkIdx: null,
      controller: new AbortController(),
      onProgress(e, file) {
        const fileObj = fd.fileStat.get(file);
        fileObj.status = FILE_STATUS.UPLOADING;
        fileObj.percentage += e.percentage;
        fileObj.uploadedChunkSize += e.loaded;
        fileObj.curChunkIdx = e.curChunkIdx;
        console.log(fileObj);

        $list[0].querySelectorAll('tr').forEach((el) => {
          if (el.id === uploadId && el.querySelector('.name').textContent === file.name) {
            // el.querySelector(".percent").textContent = Math.round(fileObj.percentage) + '%';
            el.querySelector('.progress-bar').style.width = Math.round(fileObj.percentage) + '%';
          }
        });
      },
      onComplete(e, file) {
        const fileObj = fd.fileStat.get(file);
        fileObj.status = FILE_STATUS.COMPLETED;
        if (fileObj.uploadedChunkSize === file.size) {
          fileObj.percentage = 100;
        }
        console.log(fileObj);
        // uploadList[0].querySelectorAll('li').forEach((el) => {
        //   if (el.querySelector(".name").textContent === file.name) {
        //     el.querySelector(".percent").textContent = 100 + '%';
        //     el.querySelector('.progress').style.width = 100 + '%';
        //     el.querySelector('.pause').classList.add("play");
        //   }
        // });

        $list[0].querySelectorAll('tr').forEach((el) => {
          if (el.id === uploadId && el.querySelector('.name').textContent === file.name) {
            // el.querySelector(".percent").textContent = '100%';
            el.querySelector('.progress-bar').style.width = '100%';
          }
        });
      },
      onAbort(e, file) {
        const fileObj = fd.fileStat.get(file);
        console.log('onAbort function')
        fileObj.status = FILE_STATUS.PAUSED;
        fileObj.controller = new AbortController();

        if (fd.uploadAll) {
          if (fd.upFiles.length > fd.curFileIdx + 1) fd.curFileIdx++;

          const fileLoop = async (fileIdx) => {
            await uploadSingleFile(fileIdx, uploadId);
            if (fd.upFiles.length > fileIdx + 1) {
              fileIdx++;
              fileLoop(fileIdx);
            }
          }
          fileLoop(fd.curFileIdx);
        }
      },
      onError(e, file) {
        const fileObj = fd.fileStat.get(file);
        fileObj.status = FILE_STATUS.ERROR;
        fileObj.percentage = 0;
        // uploadList[0].querySelectorAll('li').forEach((el) => {
        //   if (el.querySelector(".name").textContent === file.name) {
        //     el.querySelector(".percent").textContent = 0 + '%';
        //     el.querySelector('.progress').style.width = 0 + '%';
        //     el.querySelector('.pause').classList.add("play");
        //   }
        // });

        $list[0].querySelectorAll('tr').forEach((el) => {
          if (el.id === uploadId && el.querySelector('.name').textContent === file.name) {
            // el.querySelector(".percent").textContent = '0%';
            el.querySelector('.progress-bar').style.width = '0%';
          }
        });
      }
    } : {...fileObj};

    if (!fileObj) {
      // TODO: auth
      const auth_headers = {'Content-Type': 'application/json'};
      const auth_data = {
        'key': 'test',
      }

      await axios.post(ENDPOINTS.AUTH, auth_data, { auth_headers })
        .then(res => {
          options = {...options, ...res.data};
        });
    }

    const alloc_headers = {'Content-Type': 'application/json'};
    const alloc_data = {
      fileName: file.name,
      fileSize: file.size,
      'sessionId': options.sessionId,
    }

    // TODO: alloc
    await axios.post(ENDPOINTS.UPLOAD_ALLOC, alloc_data, { alloc_headers })
      .then(res => {
        file.fileId = res.data.fileId;
        options = {...options, ...res.data};
        console.log(options);
        fd.fileStat.set(file, {...options});
      })

    if (parseInt(options.uploaded) < parseInt(options.size)) {
      // uploadList[0].querySelectorAll('li').forEach((el) => {
      //   if (el.querySelector(".name").textContent === file.name && el.querySelector(".percent").textContent === '100%') {
      //     el.querySelector(".percent").textContent = 0 + '%';
      //     el.querySelector('.progress').style.width = 0 + '%';
      //     el.querySelector('.pause').classList.remove("play");
      //     options = {...options, curChunkIdx: 0, percentage: 0, status: ""};
      //     fd.fileStat.set(file, {...options});
      //   }
      // });

      $list[0].querySelectorAll('tr').forEach((el) => {
        if (el.id === uploadId && el.querySelector('.name').textContent === file.name && el.querySelector(".progress-bar").style.width === '100%') {
          // el.querySelector(".percent").textContent = '0%';
          el.querySelector('.progress-bar').style.width = '0%';
          options = {...options, curChunkIdx: 0, percentage: 0, status: ""};
          fd.fileStat.set(file, {...options});
        }
      });

      await uploadSingleFileChunks(file, options, uploadId);
    } else {
      if (fileObj) fileObj.status = FILE_STATUS.COMPLETED;
      // uploadList[0].querySelectorAll('li').forEach((el) => {
      //   if (el.querySelector(".name").textContent === file.name) {
      //     el.querySelector(".percent").textContent = 100 + '%';
      //     el.querySelector('.progress').style.width = 100 + '%';
      //     el.querySelector('.pause').classList.add("play");
      //   }
      // })

      $list[0].querySelectorAll('tr').forEach((el) => {
        if (el.id === uploadId && el.querySelector('.name').textContent === file.name) {
          // el.querySelector(".percent").textContent = '0%';
          el.querySelector('.progress-bar').style.width = '100%';
        }
      });
    }
  }

  function showFile(uploadId, addFiles){
    let addFilesIdx = 0;
    function fileListLoop() {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        uploadHtml(uploadId, addFiles[addFilesIdx]);

        if (addFilesIdx < addFiles.length - 1) {
          addFilesIdx++;
          fileListLoop(addFilesIdx);
        }
      }
      fileReader.readAsDataURL(addFiles[addFilesIdx]);
    }
    fileListLoop(addFilesIdx);
  }

  function uploadHtml(uploadId, item){
    const lineHtml = `      
      <tr id="${uploadId}">
        <td class="file-chk"><label class="chk"><input type="checkbox"><span></span></label></td>
        <td class="name">${item.name}</td>
        <td class="file-percent">
          <p class="progress">
            <span class="progress-bar" role="progressbar" style="width: 0" aria-valuenow="" aria-valuemin="0" aria-valuemax="100"></span>
          </p>
        </td>
        <td class="file-size">${getSize(item.size)}</td>
      </tr>
    `;

    // $('tr#upload-guide-row').remove();

    for (let i = 0; i < $container.length; i++) {
      if ($container[i].dataset.uploadId === uploadId) {
        if ($container[i].querySelector('.upload-guide .upload-guide-txt span')) $container[i].querySelector('.upload-guide .upload-guide-txt span').remove(); // 220524 수정
      }
    }

    const $list = $(`.upload-container[data-upload-id=${uploadId}] tbody table tbody`); // 220524 수정
    $list.append(lineHtml);
  }

  $uploadButton.on('click', async (e) => {
    const uploadId = $(e.currentTarget).parents('.upload-container').data('uploadId');
    const fd = fileDatas[uploadId];

    if (fd.upFiles.length) {
      if ($(e.currentTarget).text() === '파일 전송하기') {
        fd.uploadAll = true;
        $(e.currentTarget).text('일시 중지');

        if (fd.fileStat.size) {

          let uploadingFiles = [];

          for ([key, value] of fd.fileStat) {
            if (value.status !== FILE_STATUS.COMPLETED) {
              uploadingFiles.push(value.name);
            }
          }

          for (let i = 0; i < fd.upFiles.length; i++) {
            if (i >= fd.curFileIdx && !fd.fileStat.get(fd.upFiles[i])) {
              uploadingFiles.push(fd.upFiles[i].name);
            }
          }

          fd.uploadList[0].querySelectorAll('li').forEach((el) => {
            if (uploadingFiles.includes(el.querySelector('.name').textContent)) {
              el.querySelector('.pause').classList.remove("play");
            }
          });
        } else {
          fd.uploadList[0].querySelectorAll('li').forEach((el) => {
            el.querySelector('.pause').classList.remove("play");
          });
        }

        if (!fd.fileStat.get(fd.upFiles[fd.curFileIdx]) || ((fd.fileStat.get(fd.upFiles[fd.curFileIdx]) && fd.fileStat.get(fd.upFiles[fd.curFileIdx]).status !== FILE_STATUS.UPLOADING))) {
          fd.curFileIdx = 0;
          const fileLoop = async (fileIdx) => {
            await uploadSingleFile(fileIdx, uploadId);
            if (fd.uploadAll && fd.upFiles.length > fileIdx + 1) {
              fd.curFileIdx++;
              fileLoop(fd.curFileIdx);
            } else {
              fd.uploadAll = false;
              $uploadButton.text('파일 전송하기');
            }
          }
          fileLoop(fd.curFileIdx);
        }

      } else {
        fd.uploadAll = false;
        $uploadButton.text('파일 전송하기');

        fd.uploadList[0].querySelectorAll('li').forEach((el) => {
          el.querySelector('.pause').classList.add("play");
        });

        for ([key, value] of fd.fileStat) {
          if (value.status !== FILE_STATUS.COMPLETED) {
            value.controller.abort();
            value.controller = new AbortController();
          }
        }
      }
    }
  });

  $('button.save').on('click', (e) => {
    e.preventDefault();

    const container = Object.entries(fileDatas);
    let _contIdx = 0;

    const containerLoop = async (contIdx) => {
      if (container[contIdx][1].upFiles.length) {
        let _fileIdx = 0;
        fileDatas[container[_contIdx][0]].curFileIdx = 0;

        const fileLoop = async (fileIdx) => {
          if (!container[contIdx][1].fileStat.get(container[contIdx][1].upFiles[fileIdx]) || (container[contIdx][1].fileStat.get(container[contIdx][1].upFiles[fileIdx]) && container[contIdx][1].fileStat.get(container[contIdx][1].upFiles[fileIdx]).status !== FILE_STATUS.COMPLETED)) {

            $uploadButton.prop("disabled", true);
            $uploadButton.addClass('btn-secondary');
            $(e.currentTarget).prop("disabled", true);
            $(e.currentTarget).html(
              `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 파일 업로드 중...`
            );

            fileDatas[container[_contIdx][0]].uploadAll = true;
            await uploadSingleFile(fileIdx, container[contIdx][0]);

            if (container[contIdx][1].upFiles.length > fileIdx + 1) {
              _fileIdx++;
              await fileLoop(_fileIdx);
            } else {
              fileDatas[container[_contIdx][0]].uploadAll = false;
            }
          }
        }
        await fileLoop(_fileIdx);
      }

      if (container.length > contIdx + 1) {
        _contIdx++;
        await containerLoop(_contIdx);
      }
    }
    containerLoop(_contIdx).then(() => {
      location.href = location.pathname.replace('/register', '');
    });
  });
})();
