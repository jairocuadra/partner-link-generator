import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PartnerLinkService } from '../services/partner-link.service';
import { PartnerLink, ProductType } from '../models/partner-link.model';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-partner-link-generator',
  templateUrl: './partner-link-generator.component.html',
  styleUrls: ['./partner-link-generator.component.scss']
})
export class PartnerLinkGeneratorComponent implements OnInit {
  partnerLinkForm!: FormGroup;
  productTypes = Object.values(ProductType);
  previewLink: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private partnerLinkService: PartnerLinkService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.partnerLinkForm = this.fb.group({
      agencyCode: ['', [Validators.required]],
      generalAgencyCode: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      partnerName: ['', [Validators.required]],
      partnerWebsite: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      partnerPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });

    // Update preview link when form values change
    this.partnerLinkForm.valueChanges.subscribe(() => {
      this.updatePreviewLink();
    });
  }

  updatePreviewLink(): void {
    if (this.partnerLinkForm.valid) {
      const formData = this.partnerLinkForm.value;
      const baseUrl = 'https://quickquote.example.com/apply';
      const productSlug = formData.productType.toLowerCase().replace(/\s+/g, '-');
      const partnerSlug = formData.partnerName.toLowerCase().replace(/\s+/g, '-');
      
      this.previewLink = `${baseUrl}?agency=${formData.agencyCode}&ga=${formData.generalAgencyCode}&product=${productSlug}&partner=${partnerSlug}`;
    } else {
      this.previewLink = '';
    }
  }

  onGenerateLink(): void {
    if (this.partnerLinkForm.invalid) {
      this.markFormGroupTouched(this.partnerLinkForm);
      return;
    }

    const partnerData: PartnerLink = this.partnerLinkForm.value;
    
    // First check if there's an existing link
    this.isLoading = true;
    this.partnerLinkService.checkExistingLink(partnerData.agencyCode).subscribe({
      next: (existingLink) => {
        this.isLoading = false;
        
        if (existingLink) {
          // Show confirmation dialog for existing link
          this.showExistingLinkDialog(existingLink, partnerData);
        } else {
          // Show confirmation dialog for new link
          this.showNewLinkConfirmationDialog(partnerData);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error checking for existing links. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  showExistingLinkDialog(existingLink: string, partnerData: PartnerLink): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: {
        title: 'You Already Have a Partner Link',
        message: `We found an existing link for <strong>${partnerData.partnerName}</strong> with agency code <strong>${partnerData.agencyCode}</strong>.<br><br>
                 Your existing link is currently active and can be used on your website. If you need to update your link with new information, you can create a new one.<br><br>
                 <strong>Note:</strong> Creating a new link will not automatically update any existing implementations. You'll need to replace the old link on your website.`,
        existingLink: existingLink,
        confirmButtonText: 'Create New Link',
        cancelButtonText: 'Keep Existing Link'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.generateNewLink(partnerData);
      }
    });
  }

  showNewLinkConfirmationDialog(partnerData: PartnerLink): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: {
        title: 'Ready to Create Your Partner Link?',
        message: `You're about to create a partner link for <strong>${partnerData.partnerName}</strong> with the following details:<br><br>
                 <ul>
                   <li><strong>Agency Code:</strong> ${partnerData.agencyCode}</li>
                   <li><strong>General Agency Code:</strong> ${partnerData.generalAgencyCode}</li>
                   <li><strong>Product Type:</strong> ${partnerData.productType}</li>
                 </ul>
                 <br>
                 This link will allow your customers to access our quick quote tool with your agency information pre-filled. It's perfect for your website, email campaigns, and social media.`,
        link: this.previewLink,
        confirmButtonText: 'Create Link',
        cancelButtonText: 'Go Back'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.generateNewLink(partnerData);
      }
    });
  }

  generateNewLink(partnerData: PartnerLink): void {
    this.isLoading = true;
    this.partnerLinkService.generatePartnerLink(partnerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Link generated successfully!', 'Close', {
          duration: 5000
        });
        
        // Show the success dialog with the generated link
        this.dialog.open(ConfirmationDialogComponent, {
          width: '600px',
          data: {
            title: 'Your Partner Link is Ready!',
            message: `Congratulations! Your partner link for <strong>${partnerData.partnerName}</strong> has been successfully created.<br><br>
                     <strong>What this link does:</strong><br>
                     • Directs customers to our quick quote tool<br>
                     • Pre-fills your agency information<br>
                     • Tracks leads coming from your website<br>
                     <br>
                     <strong>Next steps:</strong><br>
                     1. Copy your link using the button below<br>
                     2. Add it to your website as a button or text link<br>
                     3. Use text like "Get a Quick Quote" or "Check Rates Now"<br>
                     <br>
                     Need help? Contact our partner support team at <a href="mailto:support@example.com">support@example.com</a>`,
            link: response.link,
            confirmButtonText: 'Done',
            cancelButtonText: 'Close'
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error generating link. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  onCancel(): void {
    this.partnerLinkForm.reset();
    this.previewLink = '';
  }

  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
