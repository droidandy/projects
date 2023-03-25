;(function (window, $) {
    'use string';

    function ImageCropper (options) {
        this.element = $(options.element);
        this.title = options.title.charAt(0).toUpperCase() + options.title.slice(1);

        this.images = $(options.images || options.element);
        this.handle = $(options.handle);

        this.form = this.element.find('form');
        this.fileField = this.form.find('input[type=file]');
        this.tokenField = this.form.find('input[type=hidden]');

        this.dialog = $(options.dialog);
        this.dialogPreview = this.dialog.find('.cropping-preview');
        this.dialogCancel = this.dialog.find('.cropping-cancel');
        this.dialogUpload = this.dialog.find('.cropping-result');

        this.cropper = new Cropper(this.dialogPreview[0], options.cropper);

        this.bindEvents();
    }

    ImageCropper.prototype.bindEvents = function () {
        var _this = this;

        if (!this.dialog[0].showModal) {
            dialogPolyfill.registerDialog(this.dialog[0]);
        }

        if (this.handle.length) {
            this.handle.on('click', function () {
                _this.fileField.trigger('click');
            });
        }

        this.fileField.change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    _this.cropper.replace(e.target.result);
                    _this.dialogUpload.attr('disabled', false);
                    _this.dialog[0].showModal();
                    dispatchNewEvent(_this.dialog[0], 'showModal');
                };

                reader.readAsDataURL(this.files[0]);
            }
        });

        this.dialogUpload.on('click', function () {
            var canvas = _this.cropper.getCroppedCanvas();

            _this.dialogUpload.attr('disabled', true);
            window.snackbar.MaterialSnackbar.showSnackbar({
                message: 'Uploading new image, please wait ...'
            });

            _this.sendCanvas(canvas);
        });

        this.dialogCancel.on('click', function () {
            _this.dialog[0].close();
        });
    };

    /**
     * @param {canvas} canvas
     * @return {void}
     */
    ImageCropper.prototype.sendCanvas = function (canvas) {
        var _this = this;

        canvas.toBlob(
            function (blob) {
                var formData = new FormData(_this.form[0]);

                formData.set(
                    _this.fileField.attr('name'),
                    blob,
                    Date.now()
                );

                formData.set(
                    _this.tokenField.attr('name'),
                    _this.tokenField.attr('value')
                );

                $.ajax({
                    url: _this.form.attr('action'),
                    data: formData,
                    method: "POST",
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        _this.updateImagesOnPage(response);
                    },
                    complete: function () {
                        _this.dialog[0].close();
                    }
                });
            },
            'image/jpeg'
        );
    };

    /**
     * @param {string} url
     * @return {void}
     */
    ImageCropper.prototype.updateImagesOnPage = function (url) {
        var _this = this,
            img = new Image();

        img.onload = function () {
            window.snackbar.MaterialSnackbar.showSnackbar({
                message: _this.title + ' image changed.'
            });
            _this.images.css(
                'background-image', 'url("' + url + '")'
            );
        };

        img.src = url;
    };

    window.ImageCropper = ImageCropper;

})(window, jQuery);
