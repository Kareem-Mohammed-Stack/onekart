if (!customElements.get('orca-faq-list')) {
    customElements.define(
      'orca-faq-list',
      class OrcaFaqList extends HTMLElement {
        connectedCallback() {
          this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          this.items = Array.from(this.querySelectorAll('details'));
          this.onSummaryClick = this.onSummaryClick.bind(this);

          this.items.forEach((item) => {
            const panel = item.querySelector('.orca-faq__panel');
            const summary = item.querySelector('summary');
            if (!panel || !summary) return;
            if (item.open) {
              item.classList.add('is-open');
              panel.style.height = 'auto';
            }
            summary.addEventListener('click', this.onSummaryClick, { capture: true });
          });
          this.classList.add('is-ready');
        }

        disconnectedCallback() {
          if (!this.items) return;
          this.items.forEach((item) => {
            const summary = item.querySelector('summary');
            if (summary) summary.removeEventListener('click', this.onSummaryClick, { capture: true });
          });
        }

        onSummaryClick(event) {
          const item = event.currentTarget.closest('details');
          if (!(item instanceof HTMLDetailsElement) || !this.contains(item)) return;
          event.preventDefault();
          event.stopPropagation();

          if (item.open) {
            this.collapse(item);
            return;
          }

          this.items.forEach((other) => {
            if (other !== item && other.open) this.collapse(other);
          });
          this.expand(item);
        }

        panelHeight(item) {
          const answer = item.querySelector('.orca-faq__answer');
          return answer ? answer.scrollHeight : 0;
        }

        expand(item) {
          const panel = item.querySelector('.orca-faq__panel');
          if (!panel) return;
          item.open = true;
          item.classList.add('is-open');
          if (this.reduceMotion) {
            panel.style.height = 'auto';
            return;
          }
          panel.style.height = '0px';
          panel.offsetHeight;
          panel.style.height = `${this.panelHeight(item)}px`;
          const finish = (event) => {
            if (event && event.propertyName !== 'height') return;
            panel.style.height = 'auto';
            panel.removeEventListener('transitionend', finish);
          };
          panel.addEventListener('transitionend', finish);
        }

        collapse(item) {
          const panel = item.querySelector('.orca-faq__panel');
          if (!panel) return;
          item.classList.remove('is-open');
          const startHeight = panel.style.height === 'auto' ? this.panelHeight(item) : panel.scrollHeight;
          if (this.reduceMotion || startHeight < 1) {
            item.open = false;
            panel.style.height = '0px';
            return;
          }
          panel.style.height = `${startHeight}px`;
          panel.offsetHeight;
          panel.style.height = '0px';
          const finish = (event) => {
            if (event && event.propertyName !== 'height') return;
            item.open = false;
            panel.removeEventListener('transitionend', finish);
          };
          panel.addEventListener('transitionend', finish);
        }
      }
    );
  }
