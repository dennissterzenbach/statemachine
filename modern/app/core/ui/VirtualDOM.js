class VirtualDOM {
    findElement(selector) {
        return document.querySelector(selector);
    }

    addToRealDOMElement(selector, virtualElement) {
        let parentElement = document.querySelector(selector);

        if (parentElement) {
            parentElement.appendChild(virtualElement);

            return true;
        } else {
            return false;
        }
    }

    createElement(tagName, descriptor) {
        let element = document.createElement(tagName);

        if (descriptor) {
            if (descriptor.innerText) {
                element.innerText = descriptor.innerText;
            }

            if (descriptor.className) {
                element.className = descriptor.className;
            }

            if (descriptor.classes) {
                descriptor.classes.forEach((cssClassName) => {
                    element.classList.add(cssClassName);
                });
            }
        }

        return element;
    }

    createAttribute(name, value) {
        let attrib = document.createAttribute(name);

        if (value) {
            attrib.value = value;
        }

        return attrib;
    }

    addAttributeToElement(element, attributeDescriptor) {
        if (element) {
            element.setAttributeNode(this.createAttribute(attributeDescriptor.name, attributeDescriptor.value));
        }
    }

    appendChildren(parentElement, childrenToAppend) {
        if (parentElement && childrenToAppend && childrenToAppend.length > 0) {
            childrenToAppend.forEach((childElement) => {
                parentElement.appendChild(childElement);
            })
        }
    }
}