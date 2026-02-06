    
    // let sheinPlan = null;
    
   
    
    
    document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('paymentModalDashboard');
    let backdrop = null;
    let plan = '';
    let price = 0;

    const showModal = () => {
    if (!modal) return;
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'simple-backdrop';
        document.body.appendChild(backdrop);
    }
    document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
        backdrop = null;
    }
        const bsBackdrops = document.querySelectorAll('.modal-backdrop');
        bsBackdrops.forEach((b) => b.remove());
    document.body.style.overflow = '';
    };

    const buttons = Array.from(document.querySelectorAll('.sidebar-plan'));
    buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();

        const target = e.currentTarget;
        plan = target.dataset.plan || '';
        price = Number(target.dataset.price) || 0;
        const amountEl = document.getElementById('dashboard-amount');

        // sheinPlan = plan;

        if (amountEl) amountEl.value = price;

        showModal();

    });
    });


    const radios = Array.from(document.querySelectorAll('input[name="dashboard-option"]'));
    radios.forEach((rd) => {
    rd.addEventListener('change', (e) => {
        const value = e.target.value;
        const methodInput = document.getElementById('dashboard-payment-method');
        if (methodInput) methodInput.value = value;
    });
    });


    const closeBtn = modal ? modal.querySelector('.btn-close') : null;
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal());

    



    const form = document.getElementById('dashboardPaymentForm');
    if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        



        const amountEl = document.getElementById('dashboard-amount');
        const amount = Number((amountEl && amountEl.value) || 0);
        if (price && amount < price) {
        alert('El monto es menor al valor del plan seleccionado.');
        return;
        }
        alert('Pago enviado. Plan: ' + (plan || 'N/A') + ' - Monto: ' + amount);
        closeModal();
    });
    }
    });


    // const content = document.getElementById('content-button');
    
    // const buttonPlan = document.createElement('article');

    // buttonPlan.innerHTML = `
    //     <div class="mt-3">
    //         <button type="button"  class="btn btn-outline-secondary w-100 sidebar-plan" data-plan="plata" data-price="100">Comprar Plata</button>
    //         <button type="button"  class="btn btn-warning w-100 sidebar-plan" data-plan="golden" data-price="250" style="margin-top:8px;">Comprar Golden</button>
    //       </div>

    // `

    // content.appendChild(buttonPlan);

    // let bntPlan = document.getElementById('boton-plan');

    // bntPlan.innerHTML = `
    //      <button class="btn btn-primary" onclick="changePlan('${sheinPlan}')" type="submit">Change plan</button>
    // `
