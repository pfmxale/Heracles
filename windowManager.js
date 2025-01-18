class WindowManager {
    static addDragAndResizeFunctionality(element) {
        let isDragging = false;
        let isResizing = false;
        let currentHandle = null;
        let initialX, initialY, initialWidth, initialHeight;
        
        const closeButton = element.querySelector('.close-button');
        closeButton.addEventListener('click', () => element.remove());

        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) {
                isResizing = true;
                currentHandle = e.target;
                initialWidth = element.offsetWidth;
                initialHeight = element.offsetHeight;
            } else if (!e.target.classList.contains('close-button')) {
                isDragging = true;
            }
            
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newX = e.clientX - initialX;
                const newY = e.clientY - initialY;
                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;
            } else if (isResizing) {
                e.preventDefault();
                
                const deltaX = e.clientX - (element.offsetLeft + (currentHandle.classList.contains('top-right') || 
                                          currentHandle.classList.contains('bottom-right') ? initialWidth : 0));
                const deltaY = e.clientY - (element.offsetTop + (currentHandle.classList.contains('bottom-left') || 
                                          currentHandle.classList.contains('bottom-right') ? initialHeight : 0));

                let newWidth = initialWidth;
                let newHeight = initialHeight;
                let newX = element.offsetLeft;
                let newY = element.offsetTop;

                if (currentHandle.classList.contains('top-left') || 
                    currentHandle.classList.contains('bottom-left')) {
                    newWidth = initialWidth - deltaX;
                    newX = e.clientX;
                } else {
                    newWidth = initialWidth + deltaX;
                }

                if (currentHandle.classList.contains('top-left') || 
                    currentHandle.classList.contains('top-right')) {
                    newHeight = initialHeight - deltaY;
                    newY = e.clientY;
                } else {
                    newHeight = initialHeight + deltaY;
                }

                if (newWidth >= 200) {
                    element.style.width = `${newWidth}px`;
                    if (currentHandle.classList.contains('top-left') || 
                        currentHandle.classList.contains('bottom-left')) {
                        element.style.left = `${newX}px`;
                    }
                }

                if (newHeight >= 100) {
                    element.style.height = `${newHeight}px`;
                    if (currentHandle.classList.contains('top-left') || 
                        currentHandle.classList.contains('top-right')) {
                        element.style.top = `${newY}px`;
                    }
                }
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            isResizing = false;
            currentHandle = null;
        });
    }
}
